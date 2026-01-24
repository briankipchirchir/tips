const TipsTable = () => {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>League</th>
          <th>Fixture</th>
          <th>Tip</th>
          <th>Odds</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>EPL</td>
          <td>Arsenal vs Chelsea</td>
          <td>Over 2.5</td>
          <td>1.85</td>
          <td>Premium</td>
          <td>
            <button className="btn-edit">Edit</button>
            <button className="btn-delete">Delete</button>
          </td>
        </tr>

        <tr>
          <td>Serie A</td>
          <td>Inter vs Milan</td>
          <td>BTTS</td>
          <td>1.72</td>
          <td>Free</td>
          <td>
            <button className="btn-edit">Edit</button>
            <button className="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TipsTable;
