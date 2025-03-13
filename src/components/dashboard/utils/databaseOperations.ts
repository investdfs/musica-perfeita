
import supabase from "@/lib/supabase";

/**
 * Insere um pedido de música no banco de dados
 */
export async function insertMusicRequest(requestData: any) {
  console.log("[databaseOperations] Enviando pedido para o banco de dados:", requestData);
  
  try {
    // Garantir que temos os campos mínimos necessários
    if (!requestData.user_id || !requestData.honoree_name) {
      throw new Error("Dados de pedido incompletos");
    }
    
    // Inserir o pedido no banco de dados
    const { data, error } = await supabase
      .from('music_requests')
      .insert([requestData])
      .select();
    
    if (error) {
      console.error("[databaseOperations] Erro na inserção:", error);
      throw error;
    }
    
    console.log("[databaseOperations] Inserção bem-sucedida:", data);
    return data;
  } catch (error) {
    console.error("[databaseOperations] Erro na operação de banco de dados:", error);
    
    // Usar uma abordagem mais simples sem select
    const { error: insertError } = await supabase
      .from('music_requests')
      .insert([requestData]);
    
    if (insertError) {
      console.error("[databaseOperations] Erro na inserção simples:", insertError);
      throw insertError;
    }
    
    // Buscar o pedido recém-inserido
    const { data: fetchedData, error: fetchError } = await supabase
      .from('music_requests')
      .select('*')
      .eq('user_id', requestData.user_id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error("[databaseOperations] Erro ao buscar pedido após inserção:", fetchError);
      throw fetchError;
    }
    
    console.log("[databaseOperations] Dados recuperados após inserção:", fetchedData);
    return fetchedData;
  }
}
