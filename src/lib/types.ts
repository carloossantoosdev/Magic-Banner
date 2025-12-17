export type Banner = {
  id: string;
  url: string;
  image_url: string;
  image_type: 'upload' | 'url';
  active: boolean;
  start_time?: string | null;
  end_time?: string | null;
  created_at: string;
  updated_at: string;
};

export type BannerCreateInput = {
  url: string;
  image: File | string;
  image_type: 'upload' | 'url';
  start_time?: string;
  end_time?: string;
};

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: Banner;
        Insert: Omit<Banner, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Banner, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};

