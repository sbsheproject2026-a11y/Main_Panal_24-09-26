import api from "../../api";

export const getCourses = (pageNo, pageSize, search) => {
    return api.get(
      `/Course/course-getall?referenceId=1&pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};

export const getCourseById = async (id) => {
    const response = await api.get(
        `/Course/course-getbyid/${id}`
    );

    return response.data;
};

export const updateCourse = async (data) => {

    const response = await api.put(
        "/Course/course-update",
        data
    );

    return response.data;
};

export const getCourseDelete = async (id) => {
    const response = await api.delete(
        `/Course/course-delete/${id}`
    );

    return response.data;
};

export const getDuration = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};

export const getDurationType = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};
export const getCourseType = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};
export const getCourseCategory = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};
export const getParentCourse = async () => {
    const response = await api.get(
        "/DropDown/dropdown-getparentCourse"
    );

    return response.data;
};

 export const createCourse = async (data) => {
    const formData = new FormData();

    formData.append("code", data.code || "");
    formData.append("shortName", data.shortName || "");
    formData.append("name", data.name || "");
    formData.append("nameHindi", data.nameHindi || "");
    formData.append("shortDescription", data.shortDescription || "");
    formData.append("descrption", data.descrption || "");
    formData.append("eligbilty", data.eligbilty || "");
    formData.append("duration", data.duration || 0);
    formData.append("durationTypeId", data.durationTypeId || 0);
    formData.append("parentId", data.parentId || 0);
    formData.append("categoryId", data.categoryId || 0);
    formData.append("departmentId", data.departmentId || 0);
    formData.append("totalClass", data.totalClass || 0);
    formData.append("classNo", data.classNo || 0);
    formData.append("isActive", data.isActive ?? 1);

    if (data.ProductAmounts?.length > 0) {
        data.ProductAmounts.forEach((item, index) => {
            formData.append(
                `ProductAmounts[${index}].AmountTypeId`,
                item.amountTypeId || 0
            );

            formData.append(
                `ProductAmounts[${index}].Name`,
                item.name || ""
            );

            formData.append(
                `ProductAmounts[${index}].Amount`,
                item.amount || 0
            );
        });
    }

    if (data.ProductCategoryDocuments?.length > 0) {
        data.ProductCategoryDocuments.forEach((item, index) => {
            formData.append(
                `ProductCategoryDocuments[${index}].DocumentTypeId`,
                item.materialTypeId || 0
            );

            formData.append(
                `ProductCategoryDocuments[${index}].Name`,
                item.name || ""
            );

            formData.append(
                `ProductCategoryDocuments[${index}].AltTag`,
                item.altTag || ""
            );

            if (item.file) {
                formData.append(
                    `ProductCategoryDocuments[${index}].File`,
                    item.file
                );
            }
        });
    }

    const response = await api.post(
        "/Course/course-create",
        formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }}
    );

    return response.data;
};

export const translateToHindi = async (text) => {
    const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
    );

    const data = await res.json();

    return data[0][0][0];
};

//Subjects Add 
export const createSubject = async (data) => {
    const response = await api.post(
        "/Lecture/lecture-create-subject",
        data
    );

    return response.data;
};

 
export const getSubjects = async (id) => {
    const response = await api.get(
        `/Lecture/lecture-getall/${id}`
    );

    return response.data;
};

export const getSubjectsById = async (id) => {
    const response = await api.get(
        `/Lecture/lecture-getbyid/${id}`
    );

    return response.data;
};

export const updateSubject = async (id, data) => {
    const response = await api.put(
        `/Lecture/lecture-update-subject/${id}`,
        data
    );

    return response.data;
};

export const deleteSubject = async (id) => {
    const response = await api.delete(
        `/Lecture/lecture-delete/${id}`
    );

    return response.data;
};



//Product Amount Add 
export const createProductAmount = async (data) => {
    const response = await api.post(
        "/Course/CreateCourseAmount",
        data
    );

    return response.data;
};

 
export const getProductAmounts = async (id) => {
    const response = await api.get(
        `/Course/course-productamount-get/${id}`
    );

    return response.data;
};

export const getProductAmountById = async (id) => {
    const response = await api.get(
        `/Course/course-paymentamount-getbyid/${id}`
    );

    return response.data;
};

export const updateProductAmount = async (id, data) => {
    const response = await api.put(
        `/Course/course-paymentamount-update/${id}`,
        data
    );

    return response.data;
};

export const deleteProductAmount = async (id) => {
    const response = await api.delete(
        `/Course/course-paymentamount-delete/${id}`
    );

    return response.data;
};


//Course Material
 
 

export const getCoursematerial = async (id) => {
    const response = await api.get(
        `/Course/course-material-get/${id}`
    );

    return response.data;
};
  
 
export const createCourseMaterial = async (formData) => {
  const data = new FormData();

 
  data.append("name", formData.name);
  data.append("productId", formData.productId);
  data.append("documentTypeId", formData.documentTypeId);
  data.append("srNo", formData.srNo);
  

  // Image
  if (formData.fileupload1) {
    data.append("fileupload1", formData.fileupload1);
  }
  //data.append("seoTitle", formData.seoTitle);
  data.append("altTag", formData.altTag);
   

  const response = await api.post(
    "/Course/create-course-material",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


 
 


export const SetFranchiseCourseAmount = async (id, Fid = null) => {
    const response = await api.get(
        `/DropDown/dropdown-setfranchisecourse-amount/${id}`,
        {
            params: Fid ? { Fid } : {},
        }
    );

    return response.data;
};

export const sendToSaveCommission = async (payload) => {
    const response = await api.post(
        `/Course/set-franchise-commission-amount`,
        payload,
        {
            headers: { "Content-Type": "application/json" }
        }
    );
    return response.data;
};


export const SetCourseCommission1 = async (id, Fid = null) => {
    const response = await api.get(
        `/DropDown/dropdown-set-commission-amount/${id}`,
        {
            params: Fid ? { Fid } : {},
        }
    );

    return response.data;
};

export const sendToCourseCommission = async (payload) => {
    const response = await api.post(
        `/Course/set-course-commission`,
        payload,
        {
            headers: { "Content-Type": "application/json" }
        }
    );
    return response.data;
};