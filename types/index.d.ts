export type ContentPost = {
    title: string,
    content: array,
    video?: Video,
    gallery?: Array<Image>
  }
  
  interface Image{
    _type: string,
    label: string,
    _key: string,
    asset: Asset
  }
  
  interface Video{
    _type: string,
    asset: Asset
  }
  
  type Asset = {
    _type: string,
    _ref: string
  }