import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFetch<T>(
  tableName: string, 
  options?: { 
    columns?: string; 
    orderBy?: string; 
    ascending?: boolean; 
    limit?: number;
    filters?: (query: any) => any 
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from(tableName)
          .select(options?.columns || "*");

        if (options?.orderBy) {
          query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        if (options?.filters) {
          query = options.filters(query);
        }

        const { data: result, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        setData((result as T[]) || []);
        
      } catch (err) {
        console.error(`Error en useFetch (${tableName}):`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]); // Dependencias básicas

  return { data, loading, error };
}