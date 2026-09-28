import React, { useEffect, useState } from 'react'
 
import { useNavigate } from 'react-router-dom';
import { getEmpFrenchises } from '../../AllServicesFiles/FranchiseService';
 

function FranchiseList() {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
 
  const [pageNo, setPageNo] = useState(1);

  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();

  

  useEffect(() => {
    loadFrenchises();
  }, [pageNo, pageSize, search]);


  const loadFrenchises = async () => {
    try {
      const result = await getEmpFrenchises(pageNo, pageSize, search);

      setData(result.data.data);
      setTotalRecords(result.data.totalRecords);
    }
    catch (error) {
      console.log(error);
    }
  };


  const totalPages = Math.ceil(totalRecords / pageSize);


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
  };

   
  return (
    <>
      <div>
        <h1>Franchise Detail</h1>

        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="index.html">Dashboard</a>
            </li>
            <li className="breadcrumb-item">
              Franchise Detail
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
                  Franchise List
                </h5>


                {/* Search + Page Size */}

                <div className="row mb-3">

                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Code / Name"
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>


                </div>


                <table className="table datatable">

                  <thead>

                    <tr>
                      <th>#</th>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Contact Person</th>
                      <th>Address</th>
                      <th>Mobile No</th>
                      <th>UserName</th>
                      <th>Password</th>
                      <th>City</th>
                      <th>District</th>
                      <th>State</th>
                      
                    </tr>

                  </thead>


                  <tbody>

                    {
                      data.map((item, index) => (

                        <tr key={item.id}>

                          <td>
                            {(pageNo - 1) * pageSize + index + 1}
                          </td>

                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td>{item.fatherName}</td>
                          <td>{item.address}</td>
                          <td>{item.mobileNo}</td>
                          <td>{item.userName}</td>
                          <td>{item.password}</td>
                          <td>{item.cityName}</td>
                          <td>{item.districtName}</td>
                          <td>{item.stateName}</td>


                        

                        </tr>

                      ))
                    }

                  </tbody>


                </table>



                {/* Pagination */}

                <div className="d-flex justify-content-between align-items-center">


                  <button
                    className="btn btn-primary"
                    disabled={pageNo === 1}
                    onClick={() => setPageNo(pageNo - 1)}
                  >
                    Previous
                  </button>


                  <span>
                    Page {pageNo} of {totalPages}
                  </span>


                  <button
                    className="btn btn-primary"
                    disabled={pageNo === totalPages}
                    onClick={() => setPageNo(pageNo + 1)}
                  >
                    Next
                  </button>


                </div>


              </div>

            </div>

          </div>

        </div>

      </section>


       
    </>
  )
}

export default FranchiseList;