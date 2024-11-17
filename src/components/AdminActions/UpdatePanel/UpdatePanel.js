/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";

export default function UpdatePanel() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/panelfaultreasons");
      setCategories(response.data.panelFaultReasons[0].reasons);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmitCategory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/panelfaultreasons", {
        category: sanatizeHtml(newCategory),
      });
      if (response.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleRemoveCategory = async (category) => {
    try {
      if (category === "Others") return;
      setIsLoading(true);
      const response = await axios.put("/api/panelfaultreasons", {
        category: sanatizeHtml(category),
      });
      if (response.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="h-full">
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex flex-row justify-center items-center gap-2">
            <div className="w-[70%]">
              <input
                type="text"
                id="panelCategory"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter new category"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div
              className="flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 cursor-pointer hover:bg-green-300 bg-green-400 w-[30%]"
              onClick={() => handleSubmitCategory()}
            >
              <div className="text-md text-black ">Add new category</div>
              <div className="w-[10%] p-1 mt-1">
                <img src="/images/add.svg" alt="add icon" />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="text-2xl text-black">
              Already added categories :
            </div>
            <div className="mt-6 overflow-y-scroll max-h-[61vh]">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center gap-2 p-2 rounded-lg border-2 border-gray-300 mt-2 cursor-pointer hover:bg-gray-200 h-16"
                  onClick={() => handleRemoveCategory(category)}
                >
                  <div className="text-lg text-black pl-4">{category}</div>
                  {category !== "Others" && (
                    <div className="w-[4%] p-1 mt-1">
                      <img src="/images/delete.svg" alt="delete icon" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
