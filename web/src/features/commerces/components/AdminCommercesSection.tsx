import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AppInput } from "@/components/shared";
import { Search } from "lucide-react";
import { CommerceCard } from "./CommerceCard";
import { usersService } from "@/services/usersService";
import type { PublicUser } from "feedbackboard-shared";

export function AdminCommercesSection() {
  const [search, setSearch] = useState("");

  const commerceAdminsQuery = useQuery({
    queryKey: ["commerce-admins"],
    queryFn: () => usersService.findAll(),
    select: (users: PublicUser[]) =>
      users.filter((user) => user.role === "COMMERCE_ADMIN"),
  });

  const commerceAdmins = commerceAdminsQuery.data ?? [];
  const term = search.toLowerCase();
  const filteredCommerceAdmins = commerceAdmins.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.commerce.some(
        (com) =>
          com.name.toLowerCase().includes(term) ||
          com.slug.toLowerCase().includes(term),
      ),
  );

  return (
    <Card className="px-2">
      <CardHeader className="px-2 flex flex-1 flex-col md:flex-row items-center md:justify-between">
        <CardTitle className="text-lg font-semibold">Comercios</CardTitle>
        <AppInput
          id="input-search-commerces"
          placeholder="Buscar por comercio o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={Search}
          className="md:w-80"
        />
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 px-2">
        {commerceAdminsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Cargando comercios...</p>
        )}

        {!commerceAdminsQuery.isLoading && commerceAdmins.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay usuarios comercio admin registrados.
          </p>
        )}

        {!commerceAdminsQuery.isLoading &&
          commerceAdmins.length > 0 &&
          filteredCommerceAdmins.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No se encontraron resultados.
            </p>
          )}

        {filteredCommerceAdmins.map((user) => (
          <div key={user.id} className="rounded-lg border p-3 space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{user.name}</p>
              {!user.isActive && (
                <Badge variant="destructive" className="font-normal">
                  Dueño inactivo
                </Badge>
              )}
            </div>

            <Separator />

            {user.commerce.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Este usuario no tiene comercios registrados.
              </p>
            ) : (
              <div className="space-y-3">
                {user.commerce.map((com) => (
                  <CommerceCard key={com.id} commerce={com} />
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}