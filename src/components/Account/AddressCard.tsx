interface AddressCardProps {
  account: string;
}

export function AddressCard({ account }: AddressCardProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="text-white text-xl mb-4">Address</div>
      <div className="text-gray-400 mb-6">{account}</div>
    </div>
  );
}
