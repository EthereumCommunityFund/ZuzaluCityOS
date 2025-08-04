import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import dayjs from 'dayjs';

export interface EventsResponse {
  events: Event[];
  error?: string;
}

export enum EventTimeFilter {
  UPCOMING = 'upcoming',
  PAST = 'past',
  ONGOING = 'ongoing',
}

export interface EventQueryOptions {
  timeFilter: EventTimeFilter;
  orderBy?: 'startTime' | 'endTime';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Converts legacy event data to Event format
 */
const convertLegacyEventToEvent = (legacy: any): Event => ({
  id: legacy.id,
  title: legacy.name || '',
  imageUrl: legacy.image_url || '',
  startTime: legacy.start_date || '',
  endTime: legacy.end_date || '',
  description: '',
  status: '',
  timezone: 'UTC',
  profileId: '',
  spaceId: '',
  participantCount: 0,
  minParticipant: 0,
  maxParticipant: 0,
  createdAt: '',
  source: 'legacy',
});

/**
 * Converts beta event data to Event format
 */
const convertBetaEventToEvent = (beta: any): Event => ({
  id: beta.id,
  title: beta.title,
  imageUrl: beta.imageUrl,
  startTime: beta.startTime,
  endTime: beta.endTime,
  description: '',
  status: '',
  timezone: 'UTC',
  profileId: '',
  spaceId: '',
  participantCount: 0,
  minParticipant: 0,
  maxParticipant: 0,
  createdAt: '',
  source: 'beta',
});

/**
 * Fetches events from both beta and legacy tables based on time filter
 */
export const fetchAndMergeEvents = async ({
  timeFilter,
  orderBy = 'startTime',
  orderDirection = 'asc',
}: EventQueryOptions): Promise<EventsResponse> => {
  try {
    const now = dayjs();
    let timeCondition: {
      field: string;
      operator: string;
      value: string;
    } | null = null;

    // Determine time filtering conditions
    switch (timeFilter) {
      case EventTimeFilter.UPCOMING:
        const tomorrow = now.add(1, 'day');
        timeCondition = {
          field: 'startTime',
          operator: 'gte',
          value: tomorrow.toISOString(),
        };
        break;
      case EventTimeFilter.PAST:
        timeCondition = {
          field: 'endTime',
          operator: 'lt',
          value: now.toISOString(),
        };
        break;
      case EventTimeFilter.ONGOING:
        // For ongoing: startTime <= now AND endTime >= now
        break;
    }

    let allEvents: Event[] = [];

    // Fetch beta events
    try {
      let betaQuery = supabase
        .from('betaEvents')
        .select('id, title, imageurl, startTime, endTime');

      if (timeFilter === EventTimeFilter.ONGOING) {
        betaQuery = betaQuery
          .lte('startTime', now.toISOString())
          .gte('endTime', now.toISOString());
      } else if (timeCondition) {
        switch (timeCondition.operator) {
          case 'gte':
            betaQuery = betaQuery.gte(timeCondition.field, timeCondition.value);
            break;
          case 'lt':
            betaQuery = betaQuery.lt(timeCondition.field, timeCondition.value);
            break;
        }
      }

      const { data: betaEventsData, error: betaError } = await betaQuery.order(
        orderBy,
        { ascending: orderDirection === 'asc' },
      );

      if (betaError) {
        console.error('Error fetching beta events:', betaError);
      } else if (betaEventsData) {
        const betaEvents = betaEventsData.map(convertBetaEventToEvent);
        allEvents = [...allEvents, ...betaEvents];
      }
    } catch (error) {
      console.error('Error in beta events query:', error);
    }

    // Fetch legacy events
    try {
      let legacyQuery = supabase
        .from('legacyEvents')
        .select('id, name, image_url, start_date, end_date');

      if (timeFilter === EventTimeFilter.ONGOING) {
        legacyQuery = legacyQuery
          .lte('start_date', now.toISOString())
          .gte('end_date', now.toISOString());
      } else if (timeCondition) {
        const legacyField =
          timeCondition.field === 'startTime' ? 'start_date' : 'end_date';
        switch (timeCondition.operator) {
          case 'gte':
            legacyQuery = legacyQuery.gte(legacyField, timeCondition.value);
            break;
          case 'lt':
            legacyQuery = legacyQuery.lt(legacyField, timeCondition.value);
            break;
        }
      }

      const { data: legacyEventsData, error: legacyError } =
        await legacyQuery.order(
          orderBy === 'startTime' ? 'start_date' : 'end_date',
          { ascending: orderDirection === 'asc' },
        );

      if (legacyError) {
        console.error('Error fetching legacy events:', legacyError);
      } else if (legacyEventsData) {
        const convertedLegacyEvents = legacyEventsData
          .filter((legacy): legacy is NonNullable<typeof legacy> => !!legacy.id)
          .map(convertLegacyEventToEvent);
        allEvents = [...allEvents, ...convertedLegacyEvents];
      }
    } catch (error) {
      console.error('Error in legacy events query:', error);
    }

    // Sort merged events
    allEvents.sort((a, b) => {
      const dateA = new Date(a[orderBy]).getTime();
      const dateB = new Date(b[orderBy]).getTime();
      return orderDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return { events: allEvents };
  } catch (error) {
    console.error('Error fetching and merging events:', error);
    return { events: [], error: 'Failed to fetch events' };
  }
};

/**
 * Adds location data to events by fetching from locations table
 */
export const addLocationsToEvents = async (
  events: Event[],
): Promise<Event[]> => {
  try {
    const eventIds = events.map((event) => event.id);
    const { data } = await supabase
      .from('locations')
      .select('*')
      .in('eventId', eventIds);

    data?.forEach((location: any) => {
      const event = events.find((event) => event.id === location.eventId);
      if (event) {
        event.location = location.name;
      }
    });

    return events;
  } catch (error) {
    console.error('Error adding locations to events:', error);
    return events;
  }
};

/**
 * Convenience functions for specific time filters
 */
export const fetchUpcomingEvents = () =>
  fetchAndMergeEvents({ timeFilter: EventTimeFilter.UPCOMING });

export const fetchPastEvents = () =>
  fetchAndMergeEvents({
    timeFilter: EventTimeFilter.PAST,
    orderDirection: 'desc',
  });

export const fetchOngoingEvents = () =>
  fetchAndMergeEvents({
    timeFilter: EventTimeFilter.ONGOING,
    orderDirection: 'desc',
  });
