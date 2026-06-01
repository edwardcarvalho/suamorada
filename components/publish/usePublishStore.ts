import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UploadedImage {
  id:       string;       // uuid local
  url:      string;       // URL pública R2
  key:      string;       // chave R2
  preview:  string;       // object URL local para preview
  isCover:  boolean;
  position: number;
  width?:   number;
  height?:  number;
  uploading:boolean;
  error?:   string;
}

export interface PublishFormData {
  // Step 1
  listingType:  "sale" | "rent" | "";
  propertyType: string;
  // Step 2
  lat:          string;
  lng:          string;
  addressStreet:     string;
  addressParish:     string;
  addressMunicipality: string;
  addressDistrict:   string;
  addressPostalCode: string;
  hideExactAddress:  boolean;
  // Step 3
  title:           string;
  description:     string;
  price:           string;
  priceNegotiable: boolean;
  bedrooms:        number;
  bathrooms:       number;
  areaUseful:      string;
  areaGross:       string;
  floor:           string;
  totalFloors:     string;
  condition:       string;
  energyCertificate: string;
  hasGarage:   boolean;
  hasElevator: boolean;
  hasPool:     boolean;
  hasGarden:   boolean;
  features:    string[];
  // Step 4
  images: UploadedImage[];
}

interface PublishStore {
  step:      number;
  data:      PublishFormData;
  setStep:   (s: number) => void;
  setField:  <K extends keyof PublishFormData>(key: K, val: PublishFormData[K]) => void;
  setData:   (partial: Partial<PublishFormData>) => void;
  addImage:  (img: UploadedImage) => void;
  updateImage: (id: string, partial: Partial<UploadedImage>) => void;
  removeImage: (id: string) => void;
  reorderImages: (images: UploadedImage[]) => void;
  reset:     () => void;
}

const INITIAL: PublishFormData = {
  listingType: "", propertyType: "",
  lat: "", lng: "",
  addressStreet: "", addressParish: "",
  addressMunicipality: "", addressDistrict: "",
  addressPostalCode: "", hideExactAddress: false,
  title: "", description: "", price: "",
  priceNegotiable: false, bedrooms: 2, bathrooms: 1,
  areaUseful: "", areaGross: "", floor: "", totalFloors: "",
  condition: "used", energyCertificate: "",
  hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
  features: [], images: [],
};

export const usePublishStore = create<PublishStore>()(
  persist(
    (set) => ({
      step: 1,
      data: INITIAL,
      setStep:  (step) => set({ step }),
      setField: (key, val) => set((s) => ({ data: { ...s.data, [key]: val } })),
      setData:  (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
      addImage: (img) => set((s) => ({ data: { ...s.data, images: [...s.data.images, img] } })),
      updateImage: (id, partial) => set((s) => ({
        data: { ...s.data, images: s.data.images.map((i) => i.id === id ? { ...i, ...partial } : i) }
      })),
      removeImage: (id) => set((s) => ({
        data: {
          ...s.data,
          images: s.data.images
            .filter((i) => i.id !== id)
            .map((i, idx) => ({ ...i, position: idx, isCover: idx === 0 }))
        }
      })),
      reorderImages: (images) => set((s) => ({
        data: { ...s.data, images: images.map((i, idx) => ({ ...i, position: idx, isCover: idx === 0 })) }
      })),
      reset: () => set({ step: 1, data: INITIAL }),
    }),
    {
      name: "suamorada-publish",
      // Não persistir object URLs (revogados após reload)
      partialize: (s) => ({
        ...s,
        data: {
          ...s.data,
          images: s.data.images.map((i) => ({ ...i, preview: "" })),
        },
      }),
    }
  )
);
