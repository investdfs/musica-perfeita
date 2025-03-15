
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface RelationshipFieldsProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const RelationshipTypes = {
  esposa: "Esposa",
  noiva: "Noiva",
  namorada: "Namorada",
  amigo_especial: "Amigo(a) \"Especial\"",
  partner: "Parceiro(a)/Cônjuge",
  friend: "Amigo(a)",
  family: "Familiar (Geral)",
  parent: "Pai/Mãe",
  sibling: "Irmão/Irmã",
  child: "Filho(a)",
  colleague: "Colega de Trabalho",
  mentor: "Mentor(a)/Professor(a)",
  other: "Outro"
};

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
                <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400 bg-white text-gray-900">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white text-gray-900">
                {Object.entries(RelationshipTypes).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
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
                  className="border-pink-200 focus-visible:ring-pink-400 bg-white text-gray-900"
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
