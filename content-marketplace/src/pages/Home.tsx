import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchContents } from "../features/contents/contentsSlice";
import FiltersPanel from "../components/FiltersPanel";
import ContentGrid from "../components/ContentGrid";

const Home = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <FiltersPanel />
      <ContentGrid />
    </div>
  );
};

export default Home;
