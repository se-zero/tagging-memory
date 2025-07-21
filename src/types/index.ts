export interface Memory {
  id: string
  date: string
  dateName: string
  placeName: string
  category: string
  region: string
  comment: string
  photos: string[]
  cost?: number
  coordinates: { lat: number; lng: number }
  time: string
}

export interface DateGroup {
  date: string
  dateName: string
  memories: Memory[]
}

export interface MarkerCluster {
  id: string
  coordinate: { latitude: number; longitude: number }
  memories: Memory[]
  count: number
}

export interface PlaceGroup {
  placeName: string
  memories: Memory[]
}

export interface SearchResult {
  type: "date" | "place" | "comment"
  id: string
  title: string
  data: any
  highlightText?: string
}
