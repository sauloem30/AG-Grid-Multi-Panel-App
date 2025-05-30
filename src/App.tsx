import React, { useMemo, useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule,
  RowSelectionModule,
} from "ag-grid-community";
import { MasterDetailModule } from "ag-grid-enterprise";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  MasterDetailModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule,
  RowSelectionModule,
]);

const detailColumnDefs: ColDef[] = [
  { field: "id", headerName: "ID Number" },
  { field: "address", headerName: "Address" },
  { field: "phone", headerName: "Phone" },
  { field: "email", headerName: "Email" },
];

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 120,
  resizable: true,
  filter: true,
  floatingFilter: true,
  editable: false,
};

const generateUsers = (type: "properties" | "franchises") =>
  Array.from({ length: 25 }, (_, i) => ({
    regNumber: type === "properties" ? 1000 + i : 2000 + i,
    name: `${type === "properties" ? "Property" : "Franchise"} User ${i + 1}`,
    age: 20 + (i % 50),
    details: {
      id: `${type === "properties" ? "P" : "F"}-${1000 + i}`,
      address: `${i + 1} ${type === "properties" ? "Elm Street" : "Market Ave"}, Suite ${200 + i}`,
      phone: `555-0${type === "properties" ? "2" : "3"}0${i}`,
      email: `${type}${i + 1}@domain.com`
    }
  }));

const datasets = {
  properties: generateUsers("properties"),
  franchises: generateUsers("franchises")
};

const App = () => {
  const [entity, setEntity] = useState("properties");
  const [leftRows, setLeftRows] = useState(datasets["properties"].slice(0, 10));
  const [rightRows, setRightRows] = useState(datasets["properties"].slice(10, 20));
  const [topRows, setTopRows] = useState<any[]>([]);
  const leftGridRef = useRef<AgGridReact>(null);
  const rightGridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    const stored = localStorage.getItem("topRows");
    if (stored) {
      setTopRows(JSON.parse(stored));
    }
  }, []);

  const columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field: "regNumber",
      headerName: "Reg #",
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "age",
      headerName: "Age",
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Group",
      valueGetter: (params) => {
        const age = params.data?.age;
        if (typeof age !== "number") return "";
        if (age < 30) return "Youth";
        if (age < 50) return "Adult";
        return "Senior";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
  ];

  const pushRowsToTop = (side: "left" | "right") => {
    const gridApi = side === "left" ? leftGridRef.current?.api : rightGridRef.current?.api;
    if (!gridApi) return;
    const selectedNodes = gridApi.getSelectedNodes();

    if (!selectedNodes || selectedNodes.length === 0) {
      alert("Please select one or more rows to push.");
      return;
    }

    const selectedData = selectedNodes.map((node) => node.data);
    setTopRows((prev) => {
      const updated = [...prev, ...selectedData];
      localStorage.setItem("topRows", JSON.stringify(updated));
      return updated;
    });
  };

  const clearTopGrid = () => {
    setTopRows([]);
    localStorage.removeItem("topRows");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AG Grid Multi-Panel Reconciliation</h1>

      <div className="flex justify-center gap-4 mb-6">
        <label className="text-gray-700 font-medium">Dataset:</label>
        <select
          className="border border-gray-300 rounded px-3 py-1"
          value={entity}
          onChange={(e) => {
            const next = e.target.value as keyof typeof datasets;
            setEntity(next);
            setLeftRows(datasets[next].slice(0, 10));
            setRightRows(datasets[next].slice(10, 20));
            setTopRows([]);
            localStorage.removeItem("topRows");
          }}
        >
          <option value="properties">Properties</option>
          <option value="franchises">Franchises</option>
        </select>
      </div>

      <div className="ag-theme-alpine w-full max-w-6xl mx-auto mb-4 rounded border" style={{ height: 250 }}>
        <AgGridReact
          rowData={topRows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          getRowId={(params) => String(params.data?.regNumber)}
        />
      </div>
      <div className="flex justify-center mb-8">
        <button
          onClick={clearTopGrid}
          className="bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Clear Top Grid
        </button>
      </div>

      <div className="flex justify-between gap-6 max-w-6xl mx-auto">
        <div className="w-1/2">
          <h2 className="font-semibold text-gray-700 mb-2">Source A</h2>
          <div className="ag-theme-alpine rounded border" style={{ height: 300 }}>
            <AgGridReact
              ref={leftGridRef}
              rowData={leftRows}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              getRowId={(params) => String(params.data?.regNumber)}
            />
          </div>
          <button
            onClick={() => pushRowsToTop("left")}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Push Selected ↑
          </button>
        </div>

        <div className="w-1/2">
          <h2 className="font-semibold text-gray-700 mb-2">Source B</h2>
          <div className="ag-theme-alpine rounded border" style={{ height: 300 }}>
            <AgGridReact
              ref={rightGridRef}
              rowData={rightRows}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              getRowId={(params) => String(params.data?.regNumber)}
            />
          </div>
          <button
            onClick={() => pushRowsToTop("right")}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Push Selected ↑
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
