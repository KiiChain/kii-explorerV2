interface AccountInfoProps {
  account: string;
}

export function AccountInfo({ account }: AccountInfoProps) {
  return (
    <div className="mt-8 p-6 bg-[#231C32]/40 rounded-lg">
      <div className="mb-6">
        <div className="text-white mb-4 text-xl">Account</div>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-4 text-gray-400 w-1/3">@Type</td>
              <td className="py-4 text-white">/Cosmos</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 w-1/3">Address</td>
              <td className="py-4 text-white">{account}</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 w-1/3">Pub Key</td>
              <td className="py-4 text-white">@Type Key</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 w-1/3">Account Number</td>
              <td className="py-4 text-white">7</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-400 w-1/3">Sequence</td>
              <td className="py-4 text-white">12</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
