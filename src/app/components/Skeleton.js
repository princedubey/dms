// components/Skeleton.js
const Skeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="border border-gray-400 px-4 py-2">
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </td>
      <td className="border border-gray-400 px-4 py-2 sm:w-5/6">
        <div className="h-4 bg-gray-400 rounded w-full "></div>
      </td>
    </tr>
  );
};

export default Skeleton;
