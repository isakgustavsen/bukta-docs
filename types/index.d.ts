export type ContentPost = {
  title: string;
  content: array;
  video?: Video;
  gallery?: Array<Image>;
};

interface Image {
  _type: string;
  label: string;
  _key: string;
  asset: Asset;
}

interface Video {
  _type: string;
  asset: Asset;
}

type Asset = {
  _type: string;
  _ref: string;
};

export interface report {
  id: number;
  user_id: string;
  user_name: string
  location: string;
  date: date;
  title: string;
  description: string;
  cause: string;
  images: array<string>;
  status: 'Pending' | 'Completed';
  improvement: string;
}


export interface Comment {
  id: number,
  created_at: string,
  report_id: number,
  user_id:string,
  comment:string,
}

export type Userprofile = {
  id: string,
  sub: string,
  name: string,
  email: string,
  picture: string,
  given_name: string,
  updated_at: undefined,
  family_name: string,
  preferred_username: string
}