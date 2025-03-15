
import { z } from "zod";

export const musicRequestSchema = z.object({
  honoree_name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  relationship_type: z.string(), // Modificado para aceitar qualquer string
  custom_relationship: z.string().nullable().optional(),
  music_genre: z.string(), // Modificado para aceitar qualquer string
  music_tone: z.string(), // Modificado para aceitar qualquer string 
  voice_type: z.string(), // Modificado para aceitar qualquer string
  include_names: z.boolean().default(false),
  names_to_include: z.string().nullable().optional(),
  story: z.string().min(50, { message: "Conte sua história com pelo menos 50 caracteres" }),
  music_focus: z.string().min(10, { message: "Descreva o foco da música com pelo menos 10 caracteres" }).optional(),
  happy_memory: z.string().min(10, { message: "Descreva uma lembrança feliz com pelo menos 10 caracteres" }).optional(),
  sad_memory: z.string().min(10, { message: "Descreva uma lembrança triste com pelo menos 10 caracteres" }).optional(),
});

export type MusicRequestFormValues = z.infer<typeof musicRequestSchema>;
