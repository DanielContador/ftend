// src/shared/hooks/useCrudManager.js
import { useEffect, useState, useCallback, useRef } from "react";

export function useCrudManager(service, handleError, t, options = {}) {
  const { fetchOnMount = true } = options;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const didFetch = useRef(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.getAll();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        throw new Error(t("invalidDataFormat"));
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      handleError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [service, handleError, t]);

  const getItemById = async (id) => {
    try {
      return await service.getById(id);
    } catch (error) {
      console.error("Error editing item:", error);
      handleError(t("editError"));
    }
  };

  const createItem = async (data) => {
    try {
      await service.add(data);
      // Solo recarga la lista si fetchAll fue ejecutado alguna vez
      if (fetchOnMount || didFetch.current) {
        await fetchAll();
      }
    } catch (error) {
      console.error("Error creating item:", error);
      handleError(t("createError"));
    }
  };

  const editItem = async (id, data) => {
    try {
      const item = await service.update(id, data);
      if (fetchOnMount || didFetch.current) {
        await fetchAll();
      }
      return item;
    } catch (error) {
      console.error("Error editing item:", error);
      handleError(t("editError"));
    }
  };

  const deleteItem = async (id) => {
    try {
      await service.delete(id);
      if (fetchOnMount || didFetch.current) {
        await fetchAll();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      handleError(t("deleteError"));
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      didFetch.current = true;
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount, fetchAll]);

  return {
    items,
    loading,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    reload: fetchAll,
  };
}
