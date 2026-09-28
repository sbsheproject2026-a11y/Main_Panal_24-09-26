import React, { useEffect, useState } from "react";
import { createWallet, getFrenchisesAssign1, getPayMode } from "../../AllServicesFiles/WalletService";

const WalletRecharge = () => {
  const [frenchises, setFrenchises] = useState([]);
  const [paymode, setPaymode] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [banknames, setBankNames] = useState([]);
  const [accounttypes, setAccountTypes] = useState([]);

  const [formData, setFormData] = useState({
    totalAmount: "",
    remark: "",
    entryDate: "",
    franchiseId: "",
    payMode: "",
    accountId: "",
    slipUpload: null,
    paymentType: "",
    bankName: "",
    bankConfirmDate: "",
    transactionNo: ""
  });

  useEffect(() => {
    loadFrenchises();
    loadPayMode();
    loadPaymentType();
    loadBankNames();
    loadAccountType()
  }, []);

  const loadFrenchises = async () => {
    try {
      const result = await getFrenchisesAssign1(9);
      setFrenchises(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadPayMode = async () => {
    try {
      const result = await getPayMode(27);
      setPaymode(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  const loadPaymentType = async () => {
    try {
      const result = await getPayMode(28);
      setPaymentType(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  const loadBankNames = async () => {
    try {
      const result = await getPayMode(29);
      setBankNames(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  const loadAccountType = async () => {
    try {
      const result = await getPayMode(33);
      setAccountTypes(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleFranchiseChange = (e) => {
    const franchiseId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      franchiseId: franchiseId
    }));
  };

  const handlePayModeChange = (e) => {
    const payModeId = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      payMode: payModeId,
      paymentType: payModeId === 109 ? prev.paymentType : "",
      bankName: payModeId === 109 ? prev.bankName : "",
      bankConfirmDate: payModeId === 109 ? prev.bankConfirmDate : "",
      transactionNo: payModeId === 109 ? prev.transactionNo : "",
      slipUpload: payModeId === 109 ? prev.slipUpload : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.franchiseId) {
      alert("Please select franchise");
      return;
    }

    if (!formData.payMode) {
      alert("Please select payment mode");
      return;
    }

    if (!formData.totalAmount) {
      alert("Please enter amount");
      return;
    }

    try {
      const result = await createWallet(formData);

      alert(result?.message || "Wallet recharge submitted successfully");

      handleReset();
    } catch (error) {
      console.error("Wallet recharge error:", error);

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    }
  };

  const handleReset = () => {
    setFormData({
      totalAmount: "",
      remark: "",
      entryDate: "",
      franchiseId: "",
      payMode: "",
      accountId: "",
      slipUpload: null,
      paymentType: "",
      bankName: "",
      bankConfirmDate: "",
      transactionNo: ""
    });
  };

  const isBankPayment = Number(formData.payMode) === 109;

  return (
    <>
      <div className="wallet-page">
        <div className="recharge-card">

          <div className="card-header">
            <div>
              <h2>Wallet Recharge</h2>
              <p>Enter payment details to recharge wallet.</p>
            </div>

            <div className="secure-badge">
              ✓ Secure Payment
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="section">

              <div className="section-title">
                <span className="section-number">01</span>

                <div>
                  <h3>Franchise & Payment Mode</h3>
                  <p>Select franchise and payment method.</p>
                </div>
              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Select Franchise <span>*</span>
                  </label>

                  <select
                    name="franchiseId"
                    value={formData.franchiseId}
                    onChange={handleFranchiseChange}
                    required
                  >
                    <option value="">
                      Select Franchise
                    </option>

                    {frenchises.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Payment Mode <span>*</span>
                  </label>

                  <select
                    name="payMode"
                    value={formData.payMode}
                    onChange={handlePayModeChange}
                    required
                  >
                    <option value="">
                      Select Payment Mode
                    </option>

                    {paymode.map((item) => (
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

            </div>

            <div className="section">

              <div className="section-title">
                <span className="section-number">02</span>

                <div>
                  <h3>Recharge Details</h3>
                  <p>Enter wallet recharge information.</p>
                </div>
              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Amount <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="Enter recharge amount"
                    min="1"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Entry Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="entryDate"
                    value={formData.entryDate}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group full-width">

                  <label>
                    Remark
                  </label>

                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="Enter remark..."
                    rows="4"
                  />

                </div>

              </div>

            </div>

            {isBankPayment && (
              <div className="section bank-section">

                <div className="section-title">

                  <span className="section-number">
                    03
                  </span>

                  <div>
                    <h3>Bank Payment Details</h3>
                    <p>
                      Enter details for bank payment.
                    </p>
                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Payment Type  
                    </label>

                    <select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Payment Type
                      </option>



                      {paymentType.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}

 

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Bank Name  
                    </label>

                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Bank
                      </option>
                      {banknames.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}

                    </select>

                  </div>
                  <div className="form-group">

                    <label>
                      Exp.Ledger Head
                    </label>

                    <select
                      name="accountId"
                      value={formData.accountId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select 
                      </option>
                      {accounttypes.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Bank Confirm Date  
                    </label>

                    <input
                      type="date"
                      name="bankConfirmDate"
                      value={formData.bankConfirmDate}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      URT / DD / Cheque No  
                    </label>

                    <input
                      type="text"
                      name="transactionNo"
                      value={formData.transactionNo}
                      onChange={handleChange}
                      placeholder="Enter transaction number"
                      required
                    />

                  </div>

                </div>

              </div>
            )}

            <div className="section">

              <div className="section-title">

                <span className="section-number">
                  {isBankPayment ? "04" : "03"}
                </span>

                <div>
                  <h3>Payment Slip</h3>
                  <p>Upload payment proof.</p>
                </div>

              </div>

              <div className="upload-box">

                <input
                  type="file"
                  id="slipUpload"
                  name="slipUpload"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleChange}
                />

                <label
                  htmlFor="slipUpload"
                  className="upload-content"
                >

                  <div className="upload-icon">
                    ↑
                  </div>

                  <div>
                    <strong>
                      {formData.slipUpload
                        ? formData.slipUpload.name
                        : "Click to upload payment slip"}
                    </strong>

                    <span>
                      PNG, JPG, JPEG or PDF • Max 5MB
                    </span>
                  </div>

                  <div className="browse-btn">
                    Browse
                  </div>

                </label>

              </div>

            </div>

            <div className="form-footer">

              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
              >
                Reset
              </button>

              <button
                type="submit"
                className="submit-btn"
              >
                <span>+</span>
                Recharge Wallet
              </button>

            </div>

          </form>

        </div>
      </div>
      <style>
        {`
        .wallet-page {
    width: 100%;
    min-height: 100vh;
    padding: 32px;
    background: #f5f7fb;
    box-sizing: border-box;
    font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

.recharge-card {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e6eaf0;
    border-radius: 18px;
    box-shadow: 0 10px 35px rgba(15, 23, 42, 0.07);
    overflow: hidden;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 28px 32px;
    background: linear-gradient(135deg, #07567f 0%, #1f2937 100%);
    color: #ffffff;
}

.card-header h2 {
    margin: 0 0 6px;
    font-size: 25px;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.card-header p {
    margin: 0;
    color: #cbd5e1;
    font-size: 14px;
    line-height: 1.5;
}

.secure-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 14px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.08);
    color: #e5e7eb;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.section {
    padding: 28px 32px;
    border-bottom: 1px solid #edf0f4;
}

.section:last-of-type {
    border-bottom: 0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
}

.section-number {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #fff3eb;
    color: #f15a24;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.5px;
}

.section-title h3 {
    margin: 0 0 4px;
    color: #172033;
    font-size: 17px;
    line-height: 1.4;
    font-weight: 700;
}

.section-title p {
    margin: 0;
    color: #7b8494;
    font-size: 13px;
    line-height: 1.5;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 22px;
}

.form-group {
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    margin-bottom: 8px;
    color: #344054;
    font-size: 13px;
    line-height: 1.4;
    font-weight: 600;
}

.form-group label span {
    color: #ef4444;
    margin-left: 2px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d8dee8;
    border-radius: 9px;
    background: #ffffff;
    color: #172033;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
}

.form-group input,
.form-group select {
    height: 45px;
    padding: 0 13px;
}

.form-group textarea {
    min-height: 105px;
    padding: 12px 13px;
    resize: vertical;
    line-height: 1.5;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #a1a9b6;
}

.form-group input:hover,
.form-group select:hover,
.form-group textarea:hover {
    border-color: #b8c1ce;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #f15a24;
    box-shadow: 0 0 0 3px rgba(241, 90, 36, 0.10);
}

.form-group select {
    cursor: pointer;
    appearance: auto;
}

.bank-section {
    background: #fffaf7;
}

.bank-section .section-number {
    background: #fff0e8;
}

.upload-box {
    position: relative;
    width: 100%;
}

.upload-box input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}

.upload-content {
    min-height: 95px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    border: 1.5px dashed #cbd3df;
    border-radius: 12px;
    background: #fafbfc;
    cursor: pointer;
    transition: all 0.2s ease;
}

.upload-content:hover {
    border-color: #f15a24;
    background: #fff8f4;
}

.upload-icon {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #fff0e8;
    color: #f15a24;
    font-size: 25px;
    font-weight: 700;
}

.upload-content > div:nth-child(2) {
    min-width: 0;
    flex: 1;
}

.upload-content strong {
    display: block;
    margin-bottom: 5px;
    overflow: hidden;
    color: #273142;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.upload-content span {
    display: block;
    color: #8992a1;
    font-size: 12px;
    line-height: 1.5;
}

.browse-btn {
    padding: 9px 17px;
    border: 1px solid #f15a24;
    border-radius: 8px;
    background: #ffffff;
    color: #f15a24;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.upload-content:hover .browse-btn {
    background: #f15a24;
    color: #ffffff;
}

.form-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 22px 32px;
    background: #fafbfc;
    border-top: 1px solid #edf0f4;
}

.reset-btn,
.submit-btn {
    min-height: 44px;
    border-radius: 9px;
    padding: 0 20px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.reset-btn {
    border: 1px solid #d7dde6;
    background: #ffffff;
    color: #4b5565;
}

.reset-btn:hover {
    border-color: #b8c1ce;
    background: #f4f6f8;
    color: #1f2937;
}

.submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #f15a24;
    background: #f15a24;
    color: #ffffff;
    box-shadow: 0 5px 14px rgba(241, 90, 36, 0.20);
}

.submit-btn span {
    font-size: 20px;
    line-height: 1;
    font-weight: 400;
}

.submit-btn:hover {
    border-color: #d94c19;
    background: #d94c19;
    box-shadow: 0 7px 18px rgba(241, 90, 36, 0.26);
    transform: translateY(-1px);
}

.submit-btn:active,
.reset-btn:active {
    transform: translateY(0);
}

@media (max-width: 900px) {
    .wallet-page {
        padding: 22px;
    }

    .card-header {
        padding: 24px;
    }

    .section {
        padding: 25px 24px;
    }

    .form-footer {
        padding: 20px 24px;
    }
}

@media (max-width: 700px) {
    .wallet-page {
        padding: 12px;
    }

    .recharge-card {
        border-radius: 14px;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
        padding: 22px 18px;
    }

    .secure-badge {
        align-self: flex-start;
    }

    .section {
        padding: 22px 18px;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 17px;
    }

    .form-group.full-width {
        grid-column: auto;
    }

    .section-title {
        align-items: flex-start;
        margin-bottom: 20px;
    }

    .section-number {
        width: 36px;
        height: 36px;
        flex-basis: 36px;
    }

    .section-title h3 {
        font-size: 16px;
    }

    .upload-content {
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 15px;
    }

    .upload-content > div:nth-child(2) {
        width: calc(100% - 64px);
        flex: 1;
    }

    .browse-btn {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
    }

    .form-footer {
        flex-direction: column-reverse;
        padding: 18px;
    }

    .reset-btn,
    .submit-btn {
        width: 100%;
    }
}

@media (max-width: 420px) {
    .wallet-page {
        padding: 8px;
    }

    .card-header {
        padding: 20px 15px;
    }

    .section {
        padding: 20px 15px;
    }

    .form-footer {
        padding: 16px 15px;
    }

    .card-header h2 {
        font-size: 22px;
    }

    .upload-icon {
        width: 42px;
        height: 42px;
        flex-basis: 42px;
    }

    .upload-content > div:nth-child(2) {
        width: calc(100% - 58px);
    }
}
        
        `}
      </style>
    </>
  );
};

export default WalletRecharge;