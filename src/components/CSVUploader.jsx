import React, { useState } from 'react';
import { Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';

const CSVUploader = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(result.meta.fields);
          setData(result.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <div>
      <Input type="file" accept=".csv" onChange={handleFileUpload} mb={4} />
      <Button onClick={handleAddRow} mb={4}>Add Row</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header}>{header}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((header) => (
                <Td key={header}>
                  <Input
                    value={row[header] || ''}
                    onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                  />
                </Td>
              ))}
              <Td>
                <IconButton
                  aria-label="Delete"
                  icon={<FaTrash />}
                  onClick={() => handleRemoveRow(rowIndex)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button onClick={handleDownload} mt={4} leftIcon={<FaDownload />}>Download CSV</Button>
    </div>
  );
};

export default CSVUploader;