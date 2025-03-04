
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface RelationshipFieldsProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const RelationshipFields = ({ form }: RelationshipFieldsProps) => {
  const relationshipType = useWatch({
    control: form.control,
    name: "relationship_type"
  });

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="relationship_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-purple-700">Tipo de relacionamento</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="esposa">Esposa</SelectItem>
                <SelectItem value="noiva">Noiva</SelectItem>
                <SelectItem value="namorada">Namorada</SelectItem>
                <SelectItem value="amigo_especial">Amigo(a) "Especial"</SelectItem>
                <SelectItem value="partner">Parceiro(a)/Cônjuge</SelectItem>
                <SelectItem value="friend">Amigo(a)</SelectItem>
                <SelectItem value="family">Familiar (Geral)</SelectItem>
                <SelectItem value="parent">Pai/Mãe</SelectItem>
                <SelectItem value="sibling">Irmão/Irmã</SelectItem>
                <SelectItem value="child">Filho(a)</SelectItem>
                <SelectItem value="colleague">Colega de Trabalho</SelectItem>
                <SelectItem value="mentor">Mentor(a)/Professor(a)</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {relationshipType === 'other' && (
        <FormField
          control={form.control}
          name="custom_relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-700">Especifique o relacionamento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Chefe, vizinho, etc" 
                  className="border-pink-200 focus-visible:ring-pink-400"
                  {...field}
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default RelationshipFields;
