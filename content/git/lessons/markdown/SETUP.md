<!-- @step headings -->
# Laptop setup

Everything a new developer needs on the **first day**.
Ask *Ayla* if something is unclear.

## Accounts

Use your work email for the `GitHub` account.

<!-- @step lists -->
## Install

1. Install Git
2. Install Node.js
   - pick the LTS version
   - restart the terminal
3. Clone the repository

### First-day checklist

- [x] Laptop received
- [ ] GitHub account created
- [ ] 2FA enabled

<!-- @step links -->
## Links

Read the [team handbook](https://example.com/handbook) first.
Coding rules are in [CONTRIBUTING.md](CONTRIBUTING.md).

![Terminal after a successful clone](docs/clone.png)

<!-- @step code-tables -->
## Commands

```bash
git clone https://github.com/team/shop.git
cd shop
npm install
```

| Tool    | Version | Required |
| :------ | :-----: | -------: |
| Git     |  2.40+  |      yes |
| Node.js |   24    |      yes |
| Docker  |   any   |       no |

<!-- @step alerts -->
> [!NOTE]
> The first `npm install` takes a few minutes.

> [!WARNING]
> Never commit the `.env` file.

> Questions go to the #new-devs channel.
