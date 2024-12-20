import Sidebar from "@/components/Sidebar";
import { ContractProvider } from "@/contexts/ContractContext";
import SecondaryNavbar from "../../../components/SecondaryNavbar";

const Layout = ({ children }) => {
  return (
    <ContractProvider>
      <div className="">
        <Sidebar />
        <main className="flex-1 py-4 p-4">{children}</main>
      </div>
    </ContractProvider>
  );
};

export default Layout;
