import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Identities/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Identities/"!</div>
}
