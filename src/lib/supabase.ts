
/**
 * Arquivo de compatibilidade para redirecionar importações de @/lib/supabase
 * para o cliente Supabase correto em @/integrations/supabase/client
 */

import { supabase } from "@/integrations/supabase/client";

// Exportamos o cliente diretamente para manter a compatibilidade
export default supabase;
