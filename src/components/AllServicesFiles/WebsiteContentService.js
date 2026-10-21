import api from "../api";

export const getWebsiteContents = async () => {
    const response = await api.get(
        "/WebsiteContent/website-content-getall"
    );

    return response.data;
};

 export const createWebsiteContent = async (formData) => {
  const data = new FormData();

  // =========================
  // Main Website Content
  // =========================

  data.append("ProductTypeId", formData.productTypeId || "");
  data.append("SrNo", formData.srNo1 || "");
  data.append("Date", formData.date || "");
  data.append("Title", formData.title || "");
  data.append("ShortDescription", formData.shortDesc || "");
  data.append("Descrption", formData.desc || "");
  data.append("SEOTitle", formData.seoTitle || "");

  // int? => 0 / 1
  data.append(
    "IsActive",
    formData.isActive ? "1" : "0"
  );

  data.append(
    "IsHighlight",
    formData.isHighlight ? "1" : "0"
  );

  data.append("IsDelete", "0");


  // =========================
  // Multiple Documents / Images
  // =========================

  if (
    formData.contentItems &&
    formData.contentItems.length > 0
  ) {
    formData.contentItems.forEach((item, index) => {

      data.append(
        `ProductCategoryDocuments[${index}].SrNo`,
        item.srNo || ""
      );

      data.append(
        `ProductCategoryDocuments[${index}].Title`,
        item.name || ""
      );

      data.append(
        `ProductCategoryDocuments[${index}].AltTag`,
        item.altTag || ""
      );

      data.append(
        `ProductCategoryDocuments[${index}].IsActive`,
        item.isActive ? "1" : "0"
      );


      // File
      if (item.file) {
        data.append(
          `ProductCategoryDocuments[${index}].File`,
          item.file
        );
      }
    });
  }


  // =========================
  // API
  // =========================

  const response = await api.post(
    "/WebsiteContent/website-content-create",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
 export const updateWebsiteContent = async (formData) => {
  const data = new FormData();

  // =========================
  // Main Website Content
  // =========================

  data.append("Id", formData.id || "");
  data.append("ProductTypeId", formData.productTypeId || "");
  data.append("Title", formData.title || "");
   data.append("Date", formData.date || "");
  data.append("ShortDescription", formData.shortDesc || "");
  data.append("Descrption", formData.desc || "");
  data.append("SEOTitle", formData.seoTitle || "");
  data.append("SrNo", formData.srNo1 || "");

  // int? => 0 / 1
  data.append(
    "IsActive",
    formData.isActive ? "1" : "0"
  );

  data.append(
    "IsHighlight",
    formData.isHighlight ? "1" : "0"
  );

  data.append("IsDelete", "0");


  // =========================
  // Multiple Documents / Images
  // =========================

  if (
    formData.contentItems &&
    formData.contentItems.length > 0
  ) {
    formData.contentItems.forEach((item, index) => {

      data.append(
        `ProductCategoryDocuments[${index}].SrNo`,
        item.srNo || ""
      );

      data.append(
        `ProductCategoryDocuments[${index}].Title`,
        item.name || ""
      );

      data.append(
        `ProductCategoryDocuments[${index}].Path`,
        item.oldFile || ""
      );
      data.append(
        `ProductCategoryDocuments[${index}].AltTag`,
        item.altTag || ""
      );

      data.append(
        `ProductCategoryDocuments[${index}].IsActive`,
        item.isActive ? "1" : "0"
      );


      // File
      if (item.file) {
        data.append(
          `ProductCategoryDocuments[${index}].File`,
          item.file
        );
      }
    });
  }


  // =========================
  // API
  // =========================

  const response = await api.put(
    "/WebsiteContent/website-content-update",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getWebsiteContentById = async (id) => {
    const response = await api.get(
        `/WebsiteContent/website-content-getbyid/${id}`
    );

    return response.data;
};

export const deleteWebsiteContent = async (id) => {
    const response = await api.delete(
        `/WebsiteContent/delete/${id}`
    );

    return response.data;
};