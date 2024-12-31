import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "./sidebar";
import { StakingIcon } from "./icons";

const StakingMenuItem = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/staking");
  };

  return (
    <SidebarMenuButton
      onClick={handleClick}
      className="w-32 justify-start gap-1 text-lg"
    >
      <StakingIcon className="h-6 w-6" />
      <span className="text-lg">Staking</span>
    </SidebarMenuButton>
  );
};

export default StakingMenuItem;
