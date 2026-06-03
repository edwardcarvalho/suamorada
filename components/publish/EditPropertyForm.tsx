"use client";

import * as React from "react";
import { usePublishStore } from "./usePublishStore";
import { PublishProgress } from "./PublishProgress";
import { Step1Type }    from "./Step1Type";
import { Step2Location } from "./Step2Location";
import { Step3Details } from "./Step3Details";
import { Step4Photos }  from "./Step4Photos";

interface PropertyData {
  id: string;
  slug: string;
  listingType:  string;
  propertyType: string;
  title:        string;
  description:  string | null;
  price:        number;
  priceNegotiable: boolean;
  bedrooms:     number;
  bathrooms:    number | null;
  areaUseful:   number | null;
  areaGross:    number | null;
  floor:        number | null;
  totalFloors:  number | null;
  condition:    string | null;
  energyCertificate: string | null;
  hasGarage:    boolean;
  hasElevator:  boolean;
  hasPool:      boolean;
  hasGarden:    boolean;
  features:     string[] | null;
  lat:          string | null;
  lng:          string | null;
  addressStreet:       string | null;
  addressParish:       string | null;
  addressMunicipality: string;
  addressDistrict:     string;
  addressPostalCode:   string | null;
  images: Array<{ id: string; url: string; position: number; isCover: boolean; width?: number | null; height?: number | null }>;
}

interface Props { property: PropertyData; }

export function EditPropertyForm({ property }: Props) {
  const { step, setData, setStep, setEditId, reset } = usePublishStore();
  const [ready, setReady] = React.useState(false);

  // Pré-preenche o store com os dados do imóvel
  React.useEffect(() => {
    reset();
    setEditId(property.id); // activa modo edição no Step4Photos
    setData({
      listingType:         property.listingType as "sale" | "rent",
      propertyType:        property.propertyType,
      title:               property.title,
      description:         property.description ?? "",
      price:               String(property.price / 100),
      priceNegotiable:     property.priceNegotiable,
      bedrooms:            property.bedrooms,
      bathrooms:           property.bathrooms ?? 1,
      areaUseful:          property.areaUseful  ? String(property.areaUseful)  : "",
      areaGross:           property.areaGross   ? String(property.areaGross)   : "",
      floor:               property.floor       ? String(property.floor)       : "",
      totalFloors:         property.totalFloors ? String(property.totalFloors) : "",
      condition:           property.condition   ?? "used",
      energyCertificate:   property.energyCertificate ?? "",
      hasGarage:           property.hasGarage,
      hasElevator:         property.hasElevator,
      hasPool:             property.hasPool,
      hasGarden:           property.hasGarden,
      features:            property.features ?? [],
      lat:                 property.lat ?? "",
      lng:                 property.lng ?? "",
      addressStreet:       property.addressStreet ?? "",
      addressParish:       property.addressParish ?? "",
      addressMunicipality: property.addressMunicipality,
      addressDistrict:     property.addressDistrict,
      addressPostalCode:   property.addressPostalCode ?? "",
      images: property.images.map(img => ({
        id:        img.id,
        url:       img.url,
        key:       "",
        preview:   img.url,
        isCover:   img.isCover,
        position:  img.position,
        width:     img.width  ?? undefined,
        height:    img.height ?? undefined,
        uploading: false,
      })),
    });
    setStep(1);
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id]);

  if (!ready) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6 sm:p-8">
      <PublishProgress current={step} onStepClick={setStep} />
      {step === 1 && <Step1Type />}
      {step === 2 && <Step2Location />}
      {step === 3 && <Step3Details />}
      {step === 4 && <Step4Photos />}
    </div>
  );
}
