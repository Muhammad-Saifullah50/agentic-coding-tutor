import Login from "@/components/Login"

const LoginPage = async ({
  searchParams
}: {
  searchParams: { message?: string }
}) => {
const usableParams = await searchParams
const message = usableParams.message
  return (

    <>
      {message && (
        <div className="w-full bg-primary py-2 px-4 text-center text-sm">
          {message}
        </div>
      )}
      <Login/>
    </>
  )
}

export default LoginPage