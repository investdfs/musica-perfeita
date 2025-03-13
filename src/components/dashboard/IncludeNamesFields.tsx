
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface IncludeNamesFieldsProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const IncludeNamesFields = ({ form }: IncludeNamesFieldsProps) => {
  const includeNames = useWatch({
    control: form.control,
    name: "include_names",
  });

  return (
    <>
      <FormField
        control={form.control}
        name="include_names"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-pink-50 p-4 rounded-md">
            <FormControl>
              <Checkbox 
                checked={field.value} 
                onCheckedChange={field.onChange}
                className="border-pink-400 data-[state=checked]:bg-pink-500"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-gray-700">Citar até 4 nomes na música?</FormLabel>
              <p className="text-xs text-gray-500">
                Os nomes devem estar relacionados à história da pessoa homenageada.
              </p>
            </div>
          </FormItem>
        )}
      />
      
      {includeNames && (
        <FormField
          control={form.control}
          name="names_to_include"
          render={({ field }) => (
            <FormItem className="bg-pink-50 p-4 rounded-md -mt-2">
              <FormLabel className="text-gray-700">Quais os nomes a serem citados?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite até 4 nomes separados por vírgula" 
                  className="border-pink-200 focus-visible:ring-pink-400 bg-white text-gray-900"
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Certifique-se de mencionar estes nomes na história também para melhor contextualização.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default IncludeNamesFields;
