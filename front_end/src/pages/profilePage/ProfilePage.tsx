import Container from "@/components/shared/Container";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/dateUtil";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateAccout from "./components/UpdateAccout";
import DeleteAccount from "./components/DeleteAccount";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useGetUserByIdQuery(id as string, { skip: !id });

  return (
    <Container>
      <section className="flex items-center justify-center w-full h-full px-2">
        <div className="flex flex-col items-center w-full border rounded-md h-fit md:max-w-[40rem] px-4 py-8 relative">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            disabled={isFetching}
            className="absolute top-2 left-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center justify-center w-full">
            <div className="overflow-hidden border rounded-full lg:w-32 lg:h-32 w-28 h-28">
              {isFetching ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <DisplayAvatar id={data?.avatar_id} />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center w-full gap-2 mt-5 h-fit">
            {isFetching ? (
              <>
                <span className="h-9 w-28">
                  <Skeleton className="w-full h-full" />
                </span>
                <span className="h-9 w-28">
                  <Skeleton className="w-full h-full" />
                </span>
              </>
            ) : (
              <>
                <UpdateAccout user={data} />
                <DeleteAccount userId={data?.user_id} />
              </>
            )}
          </div>
          <div className="flex flex-col w-full gap-4 p-4 py-8 mt-5 border rounded-md bg-accent/30">
            <div className="flex flex-col items-start w-full gap-1 px-2 pb-2 border-b">
              {isFetching ? (
                <>
                  <span className="w-20 h-4">
                    <Skeleton className="w-full h-full" />
                  </span>
                  <span className="w-[70%] h-4">
                    <Skeleton className="w-full h-full" />
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs opacity-60">Name</span>
                  <span className="text-sm">
                    {data?.first_name + " " + data?.last_name}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col items-start w-full gap-1 px-2 pb-2 border-b">
              {isFetching ? (
                <>
                  <span className="w-20 h-4">
                    <Skeleton className="w-full h-full" />
                  </span>
                  <span className="w-[70%] h-4">
                    <Skeleton className="w-full h-full" />
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs opacity-60">Email</span>
                  <span className="text-sm">{data?.email}</span>
                </>
              )}
            </div>
            <div className="flex flex-col items-start w-full gap-1 px-2 pb-2 border-b">
              {isFetching ? (
                <>
                  <span className="w-20 h-4">
                    <Skeleton className="w-full h-full" />
                  </span>
                  <span className="w-[70%] h-4">
                    <Skeleton className="w-full h-full" />
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs opacity-60">Join on</span>
                  <span className="text-sm">{formatDate(data?.createdAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
