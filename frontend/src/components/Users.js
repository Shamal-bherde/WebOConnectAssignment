import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { CSVLink } from 'react-csv';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/profile');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Custom cell renderer for profile picture
  function ProfilePictureCell({ cell }) {
    return <img src={`http://localhost:3000/uploads/${cell.value}`} alt="Profile" width={50} height={50} />;
  }

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Gender', accessor: 'gender' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Phone', accessor: 'phone' },
      { Header: 'Password', accessor: 'password', Cell: ({ cell }) => '********' }, // Encrypt the password
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ cell }) => {
          const date = new Date(cell.value);
          const formattedDate = date.toLocaleDateString(); // Change the date format as per your requirement
          return (
            <>
              <span>{formattedDate}</span>
              
            </>
          );
        },
      },
      { Header: 'Profile Pic', accessor: 'profilepic', Cell: ProfilePictureCell },
    ],
    []
  );

  const data = React.useMemo(() => filteredUsers, [filteredUsers]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    pageCount,
    pageOptions,
    state: {canPreviousPage, canNextPage },
    previousPage,
    nextPage,
  } = useTable(
    {
      columns,
      data: filteredUsers,
      initialState: { pageIndex, pageSize },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleSearch = (value) => {
    setSearchValue(value);
    setPageIndex(0);
  };

  useEffect(() => {
    const filteredData = users.filter(
      (user) =>
        user.id.toString().includes(searchValue) ||
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filteredData);
  }, [users, searchValue]);
  
  return (
    <>
     
     <AppBar position="static">
		<Toolbar>
	
  	<Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}>
		
		</Typography>
		<Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}>
			WebOConnect Technologies
		</Typography>

         {/* Search input */}

         <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />

		</Toolbar>
	</AppBar>

      <br/>
    
      {/* Table */}
      <Table responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Sort direction indicator */}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination */}
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
      </div>

      <br/>

         {/* Download CSV */}
         <CSVLink data={data} filename="users.csv">
        Download CSV
      </CSVLink>
         

    
    </>
  );
}
