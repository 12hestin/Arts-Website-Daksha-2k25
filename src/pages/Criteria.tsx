import React from "react";

const markingCriteria = [
  { category: "Offstage Individual Events", first: 8, second: 6, third: 4 },
  { category: "Onstage Individual Events", first: 10, second: 7, third: 5 },
  { category: "Onstage Group Events", first: 15, second: 10, third: 7 },
];

const Criteria = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Marking Criteria</h1>
        <p className="text-lg opacity-75">Points distribution for different events</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-400">
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3">First Place</th>
              <th className="border p-3">Second Place</th>
              <th className="border p-3">Third Place</th>
            </tr>
          </thead>
          <tbody>
            {markingCriteria.map((criteria, index) => (
              <tr key={index} className="border">
                <td className="border p-3">{criteria.category}</td>
                <td className="border p-3 text-center">{criteria.first}</td>
                <td className="border p-3 text-center">{criteria.second}</td>
                <td className="border p-3 text-center">{criteria.third}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Criteria;
