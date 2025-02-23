/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from "react";
import Typography from "../typography/Typography";
import {
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { getAllProperties } from "@/services/property";
import { useQuery } from "@tanstack/react-query";
import { IProperty } from "@/types";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { Button } from "../ui/button";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

const PropertySection = () => {
  const [sortOption] = useState("name-asc");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [bedroomFilter, setBedroomFilter] = useState(0);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["PROPERTY"],
    queryFn: getAllProperties,
  });


  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationFilter(e.target.value);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };

  const handleBedroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBedroomFilter(Number(e.target.value));
  };

  const filteredProperties = properties?.filter((property: IProperty) => {
    return (
      property.location.toLowerCase().includes(locationFilter.toLowerCase()) &&
      property.pricePerNight >= priceRange[0] &&
      property.pricePerNight <= priceRange[1] &&
      property.bedrooms >= bedroomFilter
    );
  });

  const sortedProperties = filteredProperties?.slice().sort((a: IProperty, b: IProperty) => {
    if (sortOption === "name-asc") return a.title.localeCompare(b.title);
    if (sortOption === "name-desc") return b.title.localeCompare(a.title);
    if (sortOption === "price-asc") return a.pricePerNight - b.pricePerNight;
    if (sortOption === "price-desc") return b.pricePerNight - a.pricePerNight;
    return 0;
  });

  if (isLoading) return <Loader />;

  return (
    <section
      id="property"
      className="w-full bg-white py-16 text-blue-900 "
    >
      <div className="container mx-auto text-start">
        <h2 className="text-2xl font-bold mb-8 text-left md:text-left">
          Available <span className="text-yellow-600">Properties</span>
        </h2>
        <div className="mb-8 flex flex-col md:flex-row gap-4 border p-4 rounded">
          <div className="flex flex-col w-full md:w-1/4">
            <label className="block mb-2 font-semibold">Filter by location</label>
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={handleLocationChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="block mb-2 font-semibold">Min price</label>
            <input
              type="number"
              placeholder="Min price"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(e, 0)}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="block mb-2 font-semibold">Max price</label>
            <input
              type="number"
              placeholder="Max price"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(e, 1)}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="block mb-2 font-semibold">Min bedrooms</label>
            <input
              type="number"
              placeholder="Min bedrooms"
              value={bedroomFilter}
              onChange={handleBedroomChange}
              className="border p-2 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProperties?.map((property: IProperty) => {
            return (
              <div
                key={property.id}
                className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4 shadow-lg transition-transform transform hover:shadow-none relative w-full sm:w-auto"
              >
                <div className="w-full h-56 relative">
                <img
                    className="w-full h-full object-cover rounded-lg"
                    src={property.thumbnail}
                    alt={property.title}
                  />
                </div>

                <Typography
                  variant="h5"
                  className="font-bold mt-2 mb-2 text-xl capitalize truncate"
                >
                  {property.title.length > 30
                    ? `${property.title.substring(0, 30)}...`
                    : property.title}
                </Typography>

                <div className="relative  flex flex-row justify-between items-center gap-2 text-sm text-primary mt-2">
                  <div className="flex items-center ">
                    <MapPinIcon className="h-5 w-5 mr-1" />
                    <p className="truncate w-full text-lg font-semiBold max-w-xs ">
                      {property.location}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <HiOutlineCurrencyDollar className="h-5 w-5 " />
                    <span className=" text-lg font-semiBold">
                      {property.pricePerNight}/ night
                    </span>
                  </div>
                </div>

                <Link href={`/property/${property.id}`}>
                  <Button className="inline-block bg-yellow-600 text-white mt-2">
                    Book Now
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PropertySection;
