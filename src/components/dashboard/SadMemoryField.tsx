
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface SadMemoryFieldProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const SadMemoryField = ({ form }: SadMemoryFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField
      control={form.control}
      name="sad_memory"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-purple-700">Lembrança Triste</FormLabel>
          <FormControl>
            <Textarea
              placeholder={!isFocused ? "EXEMPLO: Quando nosso cachorro de estimação morreu depois de 14 anos conosco, minha mãe não conseguiu se levantar da cama por três dias. Foi a primeira vez que vi ela verdadeiramente desolada, segurando a coleira dele enquanto chorava silenciosamente." : ""}
              className="min-h-[120px] border-pink-200 focus-visible:ring-pink-400 text-gray-900 bg-white"
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!field.value) {
                  setIsFocused(false);
                }
              }}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <p className="text-xs italic text-gray-600 mt-2">
            Conte um momento difícil que marcou a vida da pessoa homenageada.
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SadMemoryField;
