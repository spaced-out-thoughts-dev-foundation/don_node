# Protocol

We will be leveraging a gossip protocol with a bootstrapped start. 

The basic process is:

1. peer connections bootstrap
2. network introduction
3. catchup
4. consensus
5. disconnection from network

***

## Peer Connections Bootstrap

In truly decentralized networks, nodes must bootstrap their peer connections, starting from some well-known set of nodes. In Bitcoin and Ethereum these are hardcoded into the codebase. In Stellar a node begins by connecting to those in its quorum set.

The Soroban Oracle network will be truly decentralized and thus we will begin from a hardcoded bootstrap.

***

## Network Introduction

Each node has core information it must share with others in order to ensure the protocol works as desired:

1. IP address and port
2. Minimum protocol version
3. Public Key

All this information along with future messages will be signed in order to ensure legitamacy.

***

## Catchup

***

## Consensus

***

## Disconnection From Network

***


## [Core Concepts]

**State:** work is represented by manifests. Each manifest is updated by a series of operations. We intend to keep each manifest as short as possible, targeting a maximum "chain" size of 5gb.

A minimum definition of work is:

```
Description: a short link
Sponsor: public key
Claimant: public key
Reward: XLM amount
```

We want to standardize a minimum definition since organizations are free to implement the details as they wish. Furthermore, we only need sponsor and claimant public keys to derive reputation.

**Reputation:**
