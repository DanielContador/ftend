// src/shared/hooks/useCrudManager.js
import { useEffect, useState, useCallback, useRef } from "react";

export function useResourceManager(service, handleError, t, options = {}) {
  const getFilteredResources = async (partialUrl, values) => {
    try {
      const data = await service.filteredResources(partialUrl + values);
      if (
        Array.isArray(data) ||
        (data.success && data.data && data.data != null)
      ) {
        return Array.isArray(data) ? data : data.data;
      } else {
        throw new Error(t("invalidDataFormat"));
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      handleError(t("getError"));
    }
  };

  return {
    getFilteredResources,
  };
}
