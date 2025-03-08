
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";
import RelationshipFields from "./RelationshipFields";

interface PersonInfoFieldsProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const PersonInfoFields = ({ form }: PersonInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="honoree_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-purple-700">Para quem é esta música?</FormLabel>
            <FormControl>
              <Input placeholder="Nome da pessoa homenageada" className="border-pink-200 focus-visible:ring-pink-400" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <RelationshipFields form={form} />
    </div>
  );
};

export default PersonInfoFields;
