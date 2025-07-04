"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@resume/ui/input";
import { Badge } from "@resume/ui/badge";
import { X } from "lucide-react";

interface JobFunctionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface JobCategory {
  name: string;
  subcategories: JobSubcategory[];
}

interface JobSubcategory {
  name: string;
  roles: string[];
}

interface DatabaseCategory {
  id: string;
  type: string;
  name: string;
  description: string | null;
  subcategories: {
    id: string;
    name: string;
    description: string | null;
    roles: string[];
  }[];
}

export function JobFunctionSelect({ value, onChange }: JobFunctionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch job function categories from database
  useEffect(() => {
    const fetchJobFunctions = async () => {
      try {
        const response = await fetch('/api/categories?type=JOB_FUNCTION');
        if (response.ok) {
          const data = await response.json();
          
          // Transform database format to component format
          const transformedCategories: JobCategory[] = data.categories.map((category: DatabaseCategory) => ({
            name: category.name,
            subcategories: category.subcategories.map(subcat => ({
              name: subcat.name,
              roles: subcat.roles
            }))
          }));
          setJobCategories(transformedCategories);
        } else {
          console.error('Failed to fetch job functions');
          // Fallback to empty array
          setJobCategories([]);
        }
      } catch (error) {
        console.error('Error fetching job functions:', error);
        // Fallback to empty array
        setJobCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobFunctions();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onChange(newTags.join(", "));
    }
    setSearchTerm("");
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    onChange(newTags.join(", "));
  };

  const filteredCategories = jobCategories
    .map((category) => ({
      ...category,
      subcategories: category.subcategories
        .map((subcat) => ({
          ...subcat,
          roles: subcat.roles.filter(
            (role) =>
              role.toLowerCase().includes(searchTerm.toLowerCase()) ||
              subcat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((subcat) => subcat.roles.length > 0),
    }))
    .filter((category) => category.subcategories.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex flex-wrap gap-2 min-h-10 p-2 border rounded-md bg-muted ${
          isOpen ? "border-primary" : "border-border"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md"
          >
            {tag}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleTagRemove(tag);
              }}
            />
          </Badge>
        ))}
        <Input
          type="text"
          placeholder={
            selectedTags.length
              ? ""
              : "Please select/enter your expected job function"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onFocus={() => setIsOpen(true)}
          required
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-2 text-muted-foreground">
              Loading job functions...
            </div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => (
              <div key={idx} className="p-2">
                <div className="font-semibold text-sm text-muted-foreground mb-1">
                  {category.name}
                </div>
                {category.subcategories.map((subcat, subIdx) => (
                  <div key={subIdx} className="ml-2 mb-2">
                    {/* <div className="text-sm font-medium text-muted-foreground mb-1">
                      {subcat.name}
                    </div> */}
                    <div className="ml-2 flex flex-wrap gap-1">
                      {subcat.roles.map((role, roleIdx) => (
                        <Badge
                          key={roleIdx}
                          className="bg-accent text-accent-foreground hover:bg-accent/80 cursor-pointer"
                          onClick={() => handleTagSelect(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-2 text-muted-foreground">
              No matching job functions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
