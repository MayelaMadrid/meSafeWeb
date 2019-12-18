import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class TableComponent extends Component {
  render() {
    let { columns, data } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, key) => {
              return <TableCell key={key}>{column.nombre}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              {columns.map((column, key) => {
                return <TableCell key={key} component="th" scope="row">{row[column.nombre]}</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default TableComponent;