# Mise en place de Watchtower (Auto-Update)

Puisque ton serveur est derrière un VPN (pas d'IP publique accessible en SSH par GitHub), la meilleure solution est d'utiliser **Watchtower**.

## Principe
1. **GitHub Actions** construit l'image Docker et l'envoie sur le registre GitHub (fait).
2. **Sur ton serveur**, tu lances ton site (une première fois).
3. **Sur ton serveur**, tu lances *Watchtower*. C'est un conteneur qui va vérifier toutes les quelques minutes si une nouvelle image est disponible. Si oui, il télécharge la nouvelle version et redémarre ton site tout seul !

## Étape 1 : Lancer ton site (si ce n'est pas déjà fait)
Connecte-toi à ton serveur et lance ton conteneur portfolio.

*Note : Il faut que tu te connectes (login) pour avoir le droit de télécharger l'image depuis ton registre privé si besoin, ou public si tu as rendu le package public.*

```bash
# 1. Login au registre GitHub (utilise ton user + un token d'accès personnel)
docker login ghcr.io -u avidflyer17

# 2. Lancer le site
docker run -d \
  --name portfolio \
  --restart unless-stopped \
  -p 3000:3000 \
  -e GMAIL_USER="ton-email@gmail.com" \
  -e GMAIL_APP_PASSWORD="ton-mot-de-passe-app" \
  ghcr.io/avidflyer17/myportfolio:latest
```

## Étape 2 : Lancer Watchtower
C'est la commande magique qui va surveiller ton conteneur `portfolio`.

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 300 \
  portfolio
```

- `--interval 300` : Vérifie les mises à jour toutes les 300 secondes (5 minutes).
- `portfolio` : C'est le nom de ton conteneur à surveiller.

Et voilà ! 🎉
Maintenant, dès que GitHub finit de construire une Release, 5 minutes plus tard max, ton serveur se met à jour tout seul.
