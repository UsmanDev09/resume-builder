import { Button } from "@resume/ui/button";
import { Input } from "@resume/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@resume/ui/popover";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { type ColorResult, type ColorChangeHandler, TwitterPicker } from "react-color"

interface ColorPickerProps {
    primaryColor: string | undefined;
    secondaryColor: string | undefined;
    onPrimaryColorChange: ColorChangeHandler;
    onSecondaryColorChange: ColorChangeHandler;
}

export default function ColorPicker( { 
    primaryColor,
    secondaryColor,
    onPrimaryColorChange,
    onSecondaryColorChange,
 } : ColorPickerProps) {
    const [showPopover, setShowPopover] = useState(false);
    
    const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fakeEvent = {
          hex: e.target.value,
          rgb: { r: 0, g: 0, b: 0, a: 1 }, // These values will be ignored
          hsl: { h: 0, s: 0, l: 0, a: 1 }, // These values will be ignored
        } as ColorResult;
        onPrimaryColorChange(fakeEvent, e);
      };
      const handleSecondaryColorChange = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const fakeEvent = {
          hex: e.target.value,
          rgb: { r: 0, g: 0, b: 0, a: 1 }, // These values will be ignored
          hsl: { h: 0, s: 0, l: 0, a: 1 }, // These values will be ignored
        } as ColorResult;
        onSecondaryColorChange(fakeEvent, e);
      };

    return (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                title="Change resume colors"
                onClick={() => setShowPopover(true)}
                >
                <PaletteIcon className="size-5" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto border-none bg-transparent shadow-none p-0"
                align="end"
            >
                <div className="flex flex-col gap-4 p-4 bg-popover rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Primary Color
                    </label>
                    <Input
              type="color"
              value={primaryColor}
              onChange={handlePrimaryColorChange}
            />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Secondary Color
                    </label>
                    <Input
                        type="color"
                        value={secondaryColor}
                        onChange={handleSecondaryColorChange}
                    />
                </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}