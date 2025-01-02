import { useRouter } from "next/router";

export default function AccountPage() {
  const router = useRouter();
  const { account, balance, staking, reward } = router.query;

  return (
    <div>
      <h1>Account Details</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance}</p>
      <p>Staking: {staking}</p>
      <p>Reward: {reward}</p>
    </div>
  );
}
