import { externalSupabase } from '@/lib/external-supabase';
import {
  DAppItemField,
  ParsedDAppData,
  ProjectSnapRow,
} from '@/types/external-database';

export class ExternalDAppService {
  /**
   * Fetch all project snaps from external database
   */
  static async getAllProjectSnaps(): Promise<ProjectSnapRow[]> {
    try {
      const { data, error } = await externalSupabase
        .from('project_snaps')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching project snaps:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch project snaps:', error);
      throw error;
    }
  }

  /**
   * Fetch project snaps by categories
   */
  static async getProjectSnapsByCategories(
    categories: string[],
  ): Promise<ProjectSnapRow[]> {
    try {
      const { data, error } = await externalSupabase
        .from('project_snaps')
        .select('*')
        .overlaps('categories', categories)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching project snaps by categories:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch project snaps by categories:', error);
      throw error;
    }
  }

  /**
   * Fetch a single project snap by ID
   */
  static async getProjectSnapById(id: number): Promise<ProjectSnapRow | null> {
    try {
      const { data, error } = await externalSupabase
        .from('project_snaps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project snap by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch project snap by ID:', error);
      throw error;
    }
  }

  /**
   * Parse items JSON field to structured data
   */
  static parseItemsField(items: any): ParsedDAppData {
    if (!Array.isArray(items)) {
      return {};
    }

    const parsedData: ParsedDAppData = {};

    items.forEach((item: DAppItemField) => {
      if (item.key && item.value !== undefined) {
        (parsedData as any)[item.key] = item.value;
      }
    });

    return parsedData;
  }

  /**
   * Get all dApps with parsed data
   */
  static async getAllDAppsWithParsedData(): Promise<
    Array<{
      id: number;
      project_id: number;
      created_at: string;
      name: string | null;
      categories: string[] | null;
      parsedData: ParsedDAppData;
    }>
  > {
    try {
      const projectSnaps = await this.getAllProjectSnaps();

      return projectSnaps.map((snap) => ({
        id: snap.id,
        project_id: snap.project_id,
        created_at: snap.created_at,
        name: snap.name,
        categories: snap.categories,
        parsedData: this.parseItemsField(snap.items),
      }));
    } catch (error) {
      console.error('Failed to get dApps with parsed data:', error);
      throw error;
    }
  }

  /**
   * Transform external data to unified Dapp format
   */
  static transformToDappFormat(snap: {
    id: number;
    project_id: number;
    created_at: string;
    name: string | null;
    categories: string[] | null;
    parsedData: ParsedDAppData;
  }) {
    const parsedData = snap.parsedData;
    return {
      id: `external_${snap.id}`,
      appName: parsedData.name || 'Unknown App',
      appType: 'space',
      developerName:
        parsedData.founders?.map((f) => f.name).join(', ') || 'Unknown Founder',
      description: JSON.stringify({
        content: parsedData.mainDescription || '',
        type: 'doc',
        isEmpty: !parsedData.mainDescription,
      }),
      bannerUrl: parsedData.logoUrl || '',
      appLogoUrl: parsedData.logoUrl || '',
      categories: parsedData.categories
        ? parsedData.categories.join(', ')
        : 'Uncategorized',
      devStatus: parsedData.devStatus || 'Unknown',
      openSource: parsedData.openSource || false,
      repositoryUrl: parsedData.codeRepo || undefined,
      appUrl: parsedData.appUrl || undefined,
      websiteUrl: parsedData.websites?.[0]?.url || undefined,
      docsUrl: parsedData.whitePaper || undefined,
      tagline: parsedData.tagline || '',
      isInstallable: parsedData.appUrl ? true : false,
      isSCApp: parsedData.dappSmartContracts ? true : false,
      scAddresses: parsedData.dappSmartContracts
        ? parsedData.dappSmartContracts
            .split(',')
            .map((address) => ({ address, chain: 'ETH' }))
        : undefined,
      auditLogUrl: '',
      profile: {
        id: 'external',
        username: 'External',
        avatar: null,
        address: '',
        did: 'external',
      },
      isLegacy: false,
    };
  }

  /**
   * Get all dApps in unified format
   */
  static async getAllDAppsInUnifiedFormat() {
    try {
      const dappsWithParsedData = await this.getAllDAppsWithParsedData();
      return dappsWithParsedData.map((snap) =>
        this.transformToDappFormat(snap),
      );
    } catch (error) {
      console.error('Failed to get dApps in unified format:', error);
      throw error;
    }
  }

  /**
   * Search dApps by name or description
   */
  static async searchDApps(searchTerm: string): Promise<ProjectSnapRow[]> {
    try {
      const { data, error } = await externalSupabase
        .from('project_snaps')
        .select('*')
        .or(`name.ilike.%${searchTerm}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching dApps:', error);
        throw error;
      }

      // Additional filtering on parsed JSON data
      const filteredData = (data || []).filter((snap) => {
        const parsedData = this.parseItemsField(snap.items);
        const description = parsedData.mainDescription?.toLowerCase() || '';
        const tagline = parsedData.tagline?.toLowerCase() || '';
        const appName = parsedData.name?.toLowerCase() || '';

        const term = searchTerm.toLowerCase();
        return (
          description.includes(term) ||
          tagline.includes(term) ||
          appName.includes(term)
        );
      });

      return filteredData;
    } catch (error) {
      console.error('Failed to search dApps:', error);
      throw error;
    }
  }
}
