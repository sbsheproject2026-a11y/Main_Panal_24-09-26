import React, { useEffect, useState } from 'react'
import { getFrenchiseById, getState, getDistrict, getCity,updateFrenchise } from '../../AllServicesFiles/FrenchiseService';
import { useNavigate, useParams } from 'react-router-dom';

function FrenchiseUpdate() {
const { id } = useParams();
const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [citys, setCitys] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({

    code: "",
    name: "",
    fatherName: "",
    mobileNo: "",
    whatsAppNo: "",
    email: "",
    stateId: 0,
    districtId: 0,
    locationId: 0,
    address: "",
    pincode: "",
    isActive: 1
  });


  useEffect(() => {
    loadState();
    if(id)
    {
        handleEdit(id);
    }
  }, []);


  const loadState = async () => {
    try {
      const result = await getState();
      setStates(result.data);
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id) => {

    try {

      const result = await getFrenchiseById(id);

      //console.log(result);


      setFormData({

        id: result.id ?? 0,
        code: result.code ?? "",
        name: result.name ?? "",
        fatherName: result.fatherName ?? "",
        locationId: result.locationId ?? 0,
        districtId: result.districtId ?? 0,
        stateId: result.stateId ?? 0,
        address: result.address ?? "",
        pincode: result.pincode ?? "",
        mobileNo: result.mobileNo ?? "",
        whatsAppNo: result.whatsAppNo ?? "",
        email: result.email ?? "",
        isActive: result.isActive ?? 1

      });

        // District load
        if(result.stateId > 0)
        {
            await loadDistrict(result.stateId);
        }


        // City load
        if(result.districtId > 0)
        {
            await loadCity(result.districtId);
        }

    }
    catch (error) {
      console.log(error);
    }

  };

  const loadDistrict = async (id) => {
    try {
      const result = await getDistrict(id);
      setDistricts(result.data);
    }
    catch (error) {
      console.log(error);
    }
  };

  const loadCity = async (id) => {
    try {
      const result = await getCity(id);
      setCitys(result.data);
    }
    catch (error) {
      console.log(error);
    }
  };


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const validateForm = () => {

    let newErrors = {};


    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Organization Name is required";
    }


    if (!formData.fatherName || formData.fatherName.trim() === "") {
      newErrors.fatherName = "Contact Person Name is required";
    }


    if (!formData.mobileNo || formData.mobileNo.trim() === "") {
      newErrors.mobileNo = "Mobile No is required";
    }


    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email Id is required";
    }


    if (!formData.locationId || formData.locationId === 0) {
      newErrors.locationId = "City is required";
    }


    if (!formData.address || formData.address.trim() === "") {
      newErrors.address = "Address is required";
    }


    if (!formData.pincode || formData.pincode.trim() === "") {
      newErrors.pincode = "PinCode is required";
    }


    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {

        const result = await updateFrenchise(formData);

        alert(result.message);
navigate("/franchise-list");

    }
    catch (error) {

        console.log(error);

    }

};


  return (
    <>

      <div>

        <h1>Franchise</h1>

      </div>


      <section className="section">

        <div className="row">

          <div className="col-lg-12">

            <div className="card">

              <div className="card-body">

                <h5 className="card-title">
                  Franchise Add
                </h5>


                <form onSubmit={handleSubmit}>


                  <div className="row">


                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Organization Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                      />

                      {
                        errors.name &&
                        <div className="text-danger">
                          {errors.name}
                        </div>
                      }
                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Contact Person Name
                      </label>

                      <input
                        type="text"
                        name="fatherName"
                        className="form-control"
                        value={formData.fatherName}
                        onChange={handleChange}
                      />
                      {
                        errors.fatherName &&
                        <div className="text-danger">
                          {errors.fatherName}
                        </div>
                      }
                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Phone No
                      </label>

                      <input
                        type="text"
                        name="mobileNo"
                        className="form-control"
                        value={formData.mobileNo}
                        onChange={handleChange}
                      />
                      {
                        errors.mobileNo &&
                        <div className="text-danger">
                          {errors.mobileNo}
                        </div>
                      }
                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        WhatsApp No
                      </label>

                      <input
                        type="text"
                        name="whatsAppNo"
                        className="form-control"
                        value={formData.whatsAppNo}
                        onChange={handleChange}
                      />

                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {
                        errors.email &&
                        <div className="text-danger">
                          {errors.email}
                        </div>
                      }

                    </div>



                    {/* State */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        State
                      </label>

                      <select
                        className="form-select"
                        value={formData.stateId}
                        onChange={(e) => {

                          const id = Number(e.target.value);

                          setFormData({
                            ...formData,
                            stateId: id,
                            districtId: 0
                          });


                          if (id > 0) {
                            loadDistrict(id);
                          }
                          else {
                            setDistricts([]);
                          }

                        }}
                      >

                        <option value={0}>
                          Select
                        </option>


                        {
                          states.map(item => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))
                        }


                      </select>

                    </div>



                    {/* District */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        District
                      </label>


                      <select
                        className="form-select"
                        value={formData.districtId}
                        onChange={(e) => {

                          const districtId = Number(e.target.value);

                          setFormData({
                            ...formData,
                            districtId: districtId,
                            locationId: 0
                          });


                          if (districtId > 0) {
                            loadCity(districtId);
                          }
                          else {
                            setCitys([]);
                          }

                        }}
                      >


                        <option value={0}>
                          Select
                        </option>


                        {
                          districts.map(item => (

                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>

                          ))
                        }


                      </select>

                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        City
                      </label>


                      <select
                        className="form-select"
                        value={formData.locationId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationId: Number(e.target.value)
                          })
                        }
                      >


                        <option value={0}>
                          Select
                        </option>


                        {
                          citys.map(item => (

                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>

                          ))
                        }


                      </select>
                      {
                        errors.locationId &&
                        <div className="text-danger">
                          {errors.locationId}
                        </div>
                      }

                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                      />

                      {
                        errors.address &&
                        <div className="text-danger">
                          {errors.address}
                        </div>
                      }
                    </div>



                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        PinCode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        className="form-control"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                      {
                        errors.pincode &&
                        <div className="text-danger">
                          {errors.pincode}
                        </div>
                      }
                    </div>



                  </div>



                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>


                </form>


              </div>

            </div>

          </div>

        </div>

      </section>


    </>
  )
}

export default FrenchiseUpdate;