import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommerceCard } from "./CommerceCard";
import { usersService } from "@/services/usersService";
import type { PublicUser } from "feedbackboard-shared";

export function AdminCommercesSection() {
  const commerceAdminsQuery = useQuery({
    queryKey: ["commerce-admins"],
    queryFn: () => usersService.findAll(),
    select: (users: PublicUser[]) =>
      users.filter((user) => user.role === "COMMERCE_ADMIN"),
  });

  const commerceAdmins = commerceAdminsQuery.data ?? [];

  if (commerceAdminsQuery.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando comercios...</p>
    );
  }

  if (commerceAdmins.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No hay usuarios comercio admin registrados.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {commerceAdmins.map((user) => (
        <Card key={user.id} className="px-2">
          <CardHeader className="px-2">
            <CardTitle className="text-base font-semibold">
              {user.name}
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-3 px-2">
            {user.commerce.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Este usuario no tiene comercios registrados.
              </p>
            ) : (
              user.commerce.map((com) => (
                <CommerceCard key={com.id} commerce={com} />
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}