import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Employee.css';

const Employee = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    employee_id: '',
    date_of_birth: '',
    gender: '',
    email: '',
    contact_phone_number: '',
    home_address: '',
    designation: '',
    department: '',
    office_location: '',
    employee_start_date: '',
    employment_type: '',
    reporting_manager: '',
    salary_details: '',
    emergency_contact_info: '',
    national_id: '',
    bank_account_details: '',
    work_experience: [],
    educational_qualifications: [],
    skills_and_certificates: [],
    marital_status: '',
    number_of_dependents: '',
    blood_group: '',
    employee_status: '',
    profile_picture: '',
    social_security_number: '',
    tax_identification_number: '',
    preferred_language: '',
    probation_period_end_date: '',
    contract_end_date: '',
    previous_employment_details: '',
    references: '',
    linkedin_profile: '',
    company_email_address: '',
    work_phone_number: '',
    employee_benefits: '',
    job_description: '',
    work_shift: '',
    leave_balance: '',
    performance_reviews: '',
    training_and_development_records: '',
    role: '',
    notes: '',
  });

  const [employees, setEmployees] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/employees/');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedFormData = {
        ...formData,
      };

      if (editIndex !== null) {
        const employeeToEdit = employees[editIndex];
        const response = await fetch(`http://127.0.0.1:8000/api/employees/${employeeToEdit.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedFormData),
        });
        const updatedEmployee = await response.json();
        const updatedEmployees = [...employees];
        updatedEmployees[editIndex] = updatedEmployee;
        setEmployees(updatedEmployees);
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/employees/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedFormData),
        });
        const newEmployee = await response.json();
        setEmployees([...employees, newEmployee]);
      }

      setFormData({
        full_name: '',
        employee_id: '',
        date_of_birth: '',
        gender: '',
        email: '',
        contact_phone_number: '',
        home_address: '',
        designation: '',
        department: '',
        office_location: '',
        employee_start_date: '',
        employment_type: '',
        reporting_manager: '',
        salary_details: '',
        emergency_contact_info: '',
        national_id: '',
        bank_account_details: '',
        work_experience: [],
        educational_qualifications: [],
        skills_and_certificates: [],
        marital_status: '',
        number_of_dependents: '',
        blood_group: '',
        employee_status: '',
        profile_picture: '',
        social_security_number: '',
        tax_identification_number: '',
        preferred_language: '',
        probation_period_end_date: '',
        contract_end_date: '',
        previous_employment_details: '',
        references: '',
        linkedin_profile: '',
        company_email_address: '',
        work_phone_number: '',
        employee_benefits: '',
        job_description: '',
        work_shift: '',
        leave_balance: '',
        performance_reviews: '',
        training_and_development_records: '',
        role: '',
        notes: '',
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const handleEdit = (index) => {
    const employeeToEdit = employees[index];
    setFormData({
      full_name: employeeToEdit.full_name,
      employee_id: employeeToEdit.employee_id,
      date_of_birth: employeeToEdit.date_of_birth,
      gender: employeeToEdit.gender,
      email: employeeToEdit.email,
      contact_phone_number: employeeToEdit.contact_phone_number,
      home_address: employeeToEdit.home_address,
      designation: employeeToEdit.designation,
      department: employeeToEdit.department,
      office_location: employeeToEdit.office_location,
      employee_start_date: employeeToEdit.employee_start_date,
      employment_type: employeeToEdit.employment_type,
      reporting_manager: employeeToEdit.reporting_manager,
      salary_details: employeeToEdit.salary_details,
      emergency_contact_info: employeeToEdit.emergency_contact_info,
      national_id: employeeToEdit.national_id,
      bank_account_details: employeeToEdit.bank_account_details,
      work_experience: employeeToEdit.work_experience,
      educational_qualifications: employeeToEdit.educational_qualifications,
      skills_and_certificates: employeeToEdit.skills_and_certificates,
      marital_status: employeeToEdit.marital_status,
      number_of_dependents: employeeToEdit.number_of_dependents,
      blood_group: employeeToEdit.blood_group,
      employee_status: employeeToEdit.employee_status,
      profile_picture: employeeToEdit.profile_picture,
      social_security_number: employeeToEdit.social_security_number,
      tax_identification_number: employeeToEdit.tax_identification_number,
      preferred_language: employeeToEdit.preferred_language,
      probation_period_end_date: employeeToEdit.probation_period_end_date,
      contract_end_date: employeeToEdit.contract_end_date,
      previous_employment_details: employeeToEdit.previous_employment_details,
      references: employeeToEdit.references,
      linkedin_profile: employeeToEdit.linkedin_profile,
      company_email_address: employeeToEdit.company_email_address,
      work_phone_number: employeeToEdit.work_phone_number,
      employee_benefits: employeeToEdit.employee_benefits,
      job_description: employeeToEdit.job_description,
      work_shift: employeeToEdit.work_shift,
      leave_balance: employeeToEdit.leave_balance,
      performance_reviews: employeeToEdit.performance_reviews,
      training_and_development_records: employeeToEdit.training_and_development_records,
      role: employeeToEdit.role,
      notes: employeeToEdit.notes,
    });
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const employeeToDelete = employees[index];
    try {
      await fetch(`http://127.0.0.1:8000/api/employees/${employeeToDelete.id}/`, {
        method: 'DELETE',
      });
      setEmployees(employees.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Form fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="full_name"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="employee_id"><i className="fas fa-id-badge"></i></label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              placeholder="Employee ID"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_of_birth"><i className="fas fa-calendar"></i></label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              placeholder="Date of Birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender"><i className="fas fa-venus-mars"></i></label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact_phone_number"><i className="fas fa-phone"></i></label>
            <input
              type="text"
              id="contact_phone_number"
              name="contact_phone_number"
              placeholder="Contact Phone Number"
              value={formData.contact_phone_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="home_address"><i className="fas fa-home"></i></label>
            <input
              type="text"
              id="home_address"
              name="home_address"
              placeholder="Home Address"
              value={formData.home_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="designation"><i className="fas fa-briefcase"></i></label>
            <input
              type="text"
              id="designation"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department"><i className="fas fa-building"></i></label>
            <input
              type="text"
              id="department"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="office_location"><i className="fas fa-map-marker-alt"></i></label>
            <input
              type="text"
              id="office_location"
              name="office_location"
              placeholder="Office Location"
              value={formData.office_location}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="employee_start_date"><i className="fas fa-calendar-alt"></i></label>
            <input
              type="date"
              id="employee_start_date"
              name="employee_start_date"
              value={formData.employee_start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="employment_type"><i className="fas fa-user-tag"></i></label>
            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Employment Type</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reporting_manager"><i className="fas fa-user-tie"></i></label>
            <input
              type="text"
              id="reporting_manager"
              name="reporting_manager"
              placeholder="Reporting Manager"
              value={formData.reporting_manager}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="salary_details"><i className="fas fa-money-bill"></i></label>
            <input
              type="text"
              id="salary_details"
              name="salary_details"
              placeholder="Salary Details"
              value={formData.salary_details}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emergency_contact_info"><i className="fas fa-phone-volume"></i></label>
            <input
              type="text"
              id="emergency_contact_info"
              name="emergency_contact_info"
              placeholder="Emergency Contact Info"
              value={formData.emergency_contact_info}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="national_id"><i className="fas fa-id-card"></i></label>
            <input
              type="text"
              id="national_id"
              name="national_id"
              placeholder="National ID/Passport Number"
              value={formData.national_id}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bank_account_details"><i className="fas fa-university"></i></label>
            <input
              type="text"
              id="bank_account_details"
              name="bank_account_details"
              placeholder="Bank Account Details"
              value={formData.bank_account_details}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="work_experience"><i className="fas fa-briefcase"></i></label>
            <textarea
              id="work_experience"
              name="work_experience"
              placeholder="Work Experience"
              value={formData.work_experience.join(', ')}
              onChange={(e) => setFormData({ ...formData, work_experience: e.target.value.split(', ') })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="educational_qualifications"><i className="fas fa-graduation-cap"></i></label>
            <textarea
              id="educational_qualifications"
              name="educational_qualifications"
              placeholder="Educational Qualifications"
              value={formData.educational_qualifications.join(', ')}
              onChange={(e) => setFormData({ ...formData, educational_qualifications: e.target.value.split(', ') })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills_and_certificates"><i className="fas fa-certificate"></i></label>
            <textarea
              id="skills_and_certificates"
              name="skills_and_certificates"
              placeholder="Skills and Certificates"
              value={formData.skills_and_certificates.join(', ')}
              onChange={(e) => setFormData({ ...formData, skills_and_certificates: e.target.value.split(', ') })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="marital_status"><i className="fas fa-heart"></i></label>
            <select
              id="marital_status"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="number_of_dependents"><i className="fas fa-users"></i></label>
            <input
              type="number"
              id="number_of_dependents"
              name="number_of_dependents"
              placeholder="Number of Dependents"
              value={formData.number_of_dependents}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="blood_group"><i className="fas fa-tint"></i></label>
            <input
              type="text"
              id="blood_group"
              name="blood_group"
              placeholder="Blood Group"
              value={formData.blood_group}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="employee_status"><i className="fas fa-toggle-on"></i></label>
            <select
              id="employee_status"
              name="employee_status"
              value={formData.employee_status}
              onChange={handleChange}
            >
              <option value="">Select Employee Status</option>
              <option value="active">Active</option>
              <option value="onboarding">Onboarding</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="profile_picture"><i className="fas fa-image"></i></label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              onChange={(e) => setFormData({ ...formData, profile_picture: e.target.files[0] })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="social_security_number"><i className="fas fa-id-card"></i></label>
            <input
              type="text"
              id="social_security_number"
              name="social_security_number"
              placeholder="Social Security Number"
              value={formData.social_security_number}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tax_identification_number"><i className="fas fa-receipt"></i></label>
            <input
              type="text"
              id="tax_identification_number"
              name="tax_identification_number"
              placeholder="Tax Identification Number"
              value={formData.tax_identification_number}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="preferred_language"><i className="fas fa-language"></i></label>
            <input
              type="text"
              id="preferred_language"
              name="preferred_language"
              placeholder="Preferred Language"
              value={formData.preferred_language}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="probation_period_end_date"><i className="fas fa-calendar-check"></i></label>
            <input
              type="date"
              id="probation_period_end_date"
              name="probation_period_end_date"
              value={formData.probation_period_end_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contract_end_date"><i className="fas fa-calendar-times"></i></label>
            <input
              type="date"
              id="contract_end_date"
              name="contract_end_date"
              value={formData.contract_end_date}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="previous_employment_details"><i className="fas fa-briefcase"></i></label>
            <textarea
              id="previous_employment_details"
              name="previous_employment_details"
              placeholder="Previous Employment Details"
              value={formData.previous_employment_details}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="references"><i className="fas fa-user-friends"></i></label>
            <textarea
              id="references"
              name="references"
              placeholder="References"
              value={formData.references}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="linkedin_profile"><i className="fab fa-linkedin"></i></label>
            <input
              type="text"
              id="linkedin_profile"
              name="linkedin_profile"
              placeholder="LinkedIn Profile"
              value={formData.linkedin_profile}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company_email_address"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="company_email_address"
              name="company_email_address"
              placeholder="Company Email Address"
              value={formData.company_email_address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="work_phone_number"><i className="fas fa-phone"></i></label>
            <input
              type="text"
              id="work_phone_number"
              name="work_phone_number"
              placeholder="Work Phone Number"
              value={formData.work_phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="employee_benefits"><i className="fas fa-gift"></i></label>
            <input
              type="text"
              id="employee_benefits"
              name="employee_benefits"
              placeholder="Employee Benefits"
              value={formData.employee_benefits}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="job_description"><i className="fas fa-clipboard"></i></label>
            <textarea
              id="job_description"
              name="job_description"
              placeholder="Job Description"
              value={formData.job_description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="work_shift"><i className="fas fa-clock"></i></label>
            <input
              type="text"
              id="work_shift"
              name="work_shift"
              placeholder="Work Shift"
              value={formData.work_shift}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="leave_balance"><i className="fas fa-umbrella-beach"></i></label>
            <input
              type="number"
              id="leave_balance"
              name="leave_balance"
              placeholder="Leave Balance"
              value={formData.leave_balance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="performance_reviews"><i className="fas fa-chart-line"></i></label>
            <textarea
              id="performance_reviews"
              name="performance_reviews"
              placeholder="Performance Reviews"
              value={formData.performance_reviews}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="training_and_development_records"><i className="fas fa-chalkboard-teacher"></i></label>
            <textarea
              id="training_and_development_records"
              name="training_and_development_records"
              placeholder="Training and Development Records"
              value={formData.training_and_development_records}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role"><i className="fas fa-user-tag"></i></label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="notes"><i className="fas fa-sticky-note"></i></label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit"><i className="fas fa-paper-plane"></i> {editIndex !== null ? 'Update' : 'Submit'}</button>
      </form>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Employee ID</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Contact Phone Number</th>
              <th>Home Address</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Office Location</th>
              <th>Employee Start Date</th>
              <th>Employment Type</th>
              <th>Reporting Manager</th>
              <th>Salary Details</th>
              <th>Emergency Contact Info</th>
              <th>National ID/Passport Number</th>
              <th>Bank Account Details</th>
              <th>Work Experience</th>
              <th>Educational Qualifications</th>
              <th>Skills and Certificates</th>
              <th>Marital Status</th>
              <th>Number of Dependents</th>
              <th>Blood Group</th>
              <th>Employee Status</th>
              <th>Profile Picture</th>
              <th>Social Security Number</th>
              <th>Tax Identification Number</th>
              <th>Preferred Language</th>
              <th>Probation Period End Date</th>
              <th>Contract End Date</th>
              <th>Previous Employment Details</th>
              <th>References</th>
              <th>LinkedIn Profile</th>
              <th>Company Email Address</th>
              <th>Work Phone Number</th>
              <th>Employee Benefits</th>
              <th>Job Description</th>
              <th>Work Shift</th>
              <th>Leave Balance</th>
              <th>Performance Reviews</th>
              <th>Training and Development Records</th>
              <th>Role</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.full_name}</td>
                <td>{employee.employee_id}</td>
                <td>{employee.date_of_birth}</td>
                <td>{employee.gender}</td>
                <td>{employee.email}</td>
                <td>{employee.contact_phone_number}</td>
                <td>{employee.home_address}</td>
                <td>{employee.designation}</td>
                <td>{employee.department}</td>
                <td>{employee.office_location}</td>
                <td>{employee.employee_start_date}</td>
                <td>{employee.employment_type}</td>
                <td>{employee.reporting_manager}</td>
                <td>{employee.salary_details}</td>
                <td>{employee.emergency_contact_info}</td>
                <td>{employee.national_id}</td>
                <td>{employee.bank_account_details}</td>
                <td>{employee.work_experience.join(', ')}</td>
                <td>{employee.educational_qualifications.join(', ')}</td>
                <td>{employee.skills_and_certificates.join(', ')}</td>
                <td>{employee.marital_status}</td>
                <td>{employee.number_of_dependents}</td>
                <td>{employee.blood_group}</td>
                <td>{employee.employee_status}</td>
                <td>{employee.profile_picture}</td>
                <td>{employee.social_security_number}</td>
                <td>{employee.tax_identification_number}</td>
                <td>{employee.preferred_language}</td>
                <td>{employee.probation_period_end_date}</td>
                <td>{employee.contract_end_date}</td>
                <td>{employee.previous_employment_details}</td>
                <td>{employee.references}</td>
                <td>{employee.linkedin_profile}</td>
                <td>{employee.company_email_address}</td>
                <td>{employee.work_phone_number}</td>
                <td>{employee.employee_benefits}</td>
                <td>{employee.job_description}</td>
                <td>{employee.work_shift}</td>
                <td>{employee.leave_balance}</td>
                <td>{employee.performance_reviews}</td>
                <td>{employee.training_and_development_records}</td>
                <td>{employee.role}</td>
                <td>{employee.notes}</td>
                <td>
                  <button onClick={() => handleEdit(index)}><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(index)}><i className="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;

