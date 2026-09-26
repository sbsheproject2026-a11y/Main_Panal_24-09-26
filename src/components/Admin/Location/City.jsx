 
import React, { useEffect, useState } from "react";
import {
  createCitys,
  getCitys,
  getCitysById,
  getCitysDelete,
  getDistrict,
  getState,
  updateCitys
} from "./LocationService";

function City() {
  const [data, setData] = useState([]);
  const [states, setStatess] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    isActive: 1,
    parentId: 0,
    stateid: 0
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteCityName, setDeleteCityName] = useState("");

  const loadStates = async () => {
    try {
      const result = await getState();
      setStatess(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDistricts = async (stateId) => {
    try {
      if (!stateId || stateId === 0) {
        setDistricts([]);
        return;
      }

      const result = await getDistrict(stateId);
      setDistricts(result.data);
    } catch (error) {
      console.log(error);
      setDistricts([]);
    }
  };

  const loadCityDetails = async () => {
    try {
      const result = await getCitys();
      setData(result.data);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadStates();
    loadCityDetails();
  }, []);

  const handleStateChange = async (e) => {
    const stateId = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      stateid: stateId,
      parentId: 0
    }));

    await loadDistricts(stateId);
  };

  const handleEdit = async (id) => {
    try {
      const result = await getCitysById(id);

      const stateId = Number(
        result.stateid || result.stateId || 0
      );

      const districtId = Number(result.parentId || 0);

      setFormData({
        id: result.id,
        code: result.code,
        name: result.name,
        isActive: result.isActive,
        parentId: districtId,
        stateid: stateId
      });

      if (stateId > 0) {
        await loadDistricts(stateId);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteCityName(name);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteId(null);
    setDeleteCityName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;

      const result = await getCitysDelete(deleteId);

      alert(
        result?.message ||
          result ||
          "City deleted successfully"
      );

      closeDeleteModal();
      await loadCityDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      if (formData.id > 0) {
        result = await updateCitys(formData);
      } else {
        result = await createCitys(formData);
      }

      alert(result.message);

      await loadCityDetails();

      setFormData({
        id: 0,
        code: "",
        name: "",
        isActive: 0,
        parentId: 0,
        stateid: 0
      });

      setDistricts([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      item.code
        ?.toString()
        .toLowerCase()
        .includes(search) ||
      item.name
        ?.toString()
        .toLowerCase()
        .includes(search)
    );
  });

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    endIndex
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];
  };

  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        <h1>City Details</h1>

        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="index.html">Dashboard</a>
            </li>

            <li className="breadcrumb-item">
              Location Detail
            </li>

            <li className="breadcrumb-item active">
              City Details
            </li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  City Details
                </h5>

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      State
                    </label>

                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        required
                        value={formData.stateid}
                        onChange={handleStateChange}
                      >
                        <option value={0}>
                          Select State
                        </option>

                        {states.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      District
                    </label>

                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        required
                        value={formData.parentId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentId: Number(
                              e.target.value
                            )
                          })
                        }
                        disabled={
                          formData.stateid === 0
                        }
                      >
                        <option value={0}>
                          {formData.stateid === 0
                            ? "First Select State"
                            : "Select District"}
                        </option>

                        {districts.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Code
                    </label>

                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="code"
                        className="form-control"
                        value={formData.code}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Name
                    </label>

                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      IsActive
                    </label>

                    <div className="col-sm-9">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          style={{
                            height: "25px",
                            width: "50px"
                          }}
                          checked={
                            formData.isActive === 1
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive:
                                e.target.checked
                                  ? 1
                                  : 0
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {formData.id > 0
                      ? "Update"
                      : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  City List
                </h5>

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <label className="me-2">
                      Show:
                    </label>

                    <select
                      className="form-select"
                      style={{ width: "90px" }}
                      value={itemsPerPage}
                      onChange={
                        handleItemsPerPageChange
                      }
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>

                    <span className="ms-2">
                      entries
                    </span>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: "220px" }}
                  />
                </div>

                <div className="text-muted mb-2">
                  {filteredData.length > 0
                    ? `Showing ${startIndex + 1} to ${Math.min(
                        endIndex,
                        filteredData.length
                      )} of ${filteredData.length}`
                    : "Showing 0 to 0 of 0"}
                </div>

                <div className="table-responsive">
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map(
                          (item, index) => (
                            <tr key={item.id}>
                              <th>
                                {startIndex +
                                  index +
                                  1}
                              </th>

                              <td>{item.code}</td>

                              <td>{item.name}</td>

                              <td>
                                <i
                                  className="bi bi-pencil-square text-primary"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "18px"
                                  }}
                                  onClick={() =>
                                    handleEdit(
                                      item.id
                                    )
                                  }
                                ></i>

                                <span className="mx-2">
                                  |
                                </span>

                                <i
                                  className="bi bi-trash-fill text-danger"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "18px"
                                  }}
                                  onClick={() =>
                                    handleDelete(
                                      item.id,
                                      item.name
                                    )
                                  }
                                ></i>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4"
                          >
                            No City Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      Prev
                    </button>

                    <div className="d-flex gap-1">
                      {pageNumbers.map((page) => (
                        <button
                          type="button"
                          key={page}
                          onClick={() =>
                            handlePageChange(page)
                          }
                          className={
                            currentPage === page
                              ? "btn btn-primary"
                              : "btn btn-outline-primary"
                          }
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleNext}
                      disabled={
                        currentPage === totalPages
                      }
                    >
                      Next
                      <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {deleteModal && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)"
            }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Confirm Delete
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                  ></button>
                </div>

                <div className="modal-body text-center">
                  <i
                    className="bi bi-exclamation-triangle-fill text-danger"
                    style={{
                      fontSize: "50px"
                    }}
                  ></i>

                  <h5 className="mt-3">
                    Are you sure?
                  </h5>

                  <p className="mb-1">
                    Do you really want to delete
                    this city?
                  </p>

                  <strong>
                    {deleteCityName}
                  </strong>

                  <p className="text-muted mt-2 mb-0">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="modal-footer justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

export default City;
 
