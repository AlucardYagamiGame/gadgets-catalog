export interface UserProfile {
  fullName: string;
  phone: string;
  city: string;
  cityRef: string;
}

export interface ProfileRow {
  full_name: string | null;
  phone: string | null;
  city: string | null;
  city_ref: string | null;
}
