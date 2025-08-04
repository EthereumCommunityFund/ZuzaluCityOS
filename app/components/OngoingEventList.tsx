import { CaretDoubleRightIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks';
import { fetchOngoingEvents } from '@/services/event';
import { Event } from '@/types';
import { ScrollShadow } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { SmallEventCard, SmallEventCardSkeleton } from './SmallEventCard';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

const getDateRangeDescription = (events: Event[]) => {
  if (events.length === 0) return '';

  const startTimes = events.map((event) => dayjs(event.startTime));
  const endTimes = events.map((event) => dayjs(event.endTime));

  const earliestStart = dayjs.min(startTimes);
  const latestEnd = dayjs.max(endTimes);

  if (!earliestStart || !latestEnd) return '';

  const startYear = earliestStart.year();
  const endYear = latestEnd.year();

  const startMonth = earliestStart.format('MMM');
  const endMonth = latestEnd.format('MMM');

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

export default function OngoingEventList() {
  const router = useRouter();
  const { isMobile } = useMediaQuery();

  const { data: ongoingEvents, isLoading } = useQuery({
    queryKey: ['ongoingEvents'],
    queryFn: async () => {
      const result = await fetchOngoingEvents();
      if (result.error) {
        console.error('Error fetching ongoing events:', result.error);
        return [];
      }
      return result.events;
    },
  });

  const dateRangeDescription = getDateRangeDescription(ongoingEvents || []);

  if (!isLoading && (!ongoingEvents || ongoingEvents.length === 0)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="On-Going Events"
        icon={<CaretDoubleRightIcon size={isMobile ? 5 : 6} />}
        description={dateRangeDescription}
        buttonText="View All On-Going"
        buttonOnPress={() => router.push('/events')}
      />
      <ScrollShadow
        visibility="right"
        orientation="horizontal"
        size={80}
        className="flex-1 overflow-auto"
      >
        <div className="flex gap-[20px] overflow-auto px-[20px]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SmallEventCardSkeleton key={index} />
              ))
            : ongoingEvents?.map((event) => (
                <SmallEventCard key={event.id} data={event} />
              ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
