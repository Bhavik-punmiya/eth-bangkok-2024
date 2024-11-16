import Sidebar from "@/components/Sidebar";
import { ContractProvider } from "@/contexts/ContractContext";
import SecondaryNavbar from "../../../components/SecondaryNavbar";

const Layout = ({ children }) => {
  return (
    <ContractProvider>
      <div className="">
        <Sidebar />
        <main className="flex-1 py-4 pr-4 pl-20">{children}</main>
      </div>
    </ContractProvider>
  );
};

export default Layout;
