/**
 * Data model for the "Superfile Paid Access & Entitlement System" map.
 *
 * Every node/edge encodes a rule supplied in the brief. Nothing about product
 * behaviour, Stripe internals, or policy is invented: unknowns are marked
 * `tbd: true` and surfaced as visible "TBD" / "Policy decision required" badges.
 * The Stripe trigger is deliberately generic ("verified payment confirmation") —
 * no specific webhook/event is named.
 *
 * Layout: `lane` places a node in a horizontal swimlane; `col` is its position
 * along the left→right sequence; `dy` nudges it within/near its lane. The
 * component turns these into pixel coordinates.
 */

export type LaneId =
  | "user"
  | "interface"
  | "identity"
  | "payment"
  | "entitlement"
  | "delivery"
  | "owner"
  | "admin"
  | "audit";

export const LANES: { id: LaneId; label: string }[] = [
  { id: "user", label: "User & customer experience" },
  { id: "interface", label: "Product interface" },
  { id: "identity", label: "Identity & account" },
  { id: "payment", label: "Payment & Stripe" },
  { id: "entitlement", label: "Entitlement & authorization" },
  { id: "delivery", label: "File delivery & protection" },
  { id: "owner", label: "File owner" },
  { id: "admin", label: "Platform admin & support" },
  { id: "audit", label: "Monitoring, notification & audit" },
];

/** Node types get distinct shape + icon + badge (never colour alone). */
export type NodeType =
  | "actor"
  | "interface"
  | "process"
  | "event"
  | "decision"
  | "state"
  | "terminal"
  | "admin"
  | "tbd";

export const NODE_TYPES: { id: NodeType; label: string }[] = [
  { id: "interface", label: "User-facing interface" },
  { id: "process", label: "Process" },
  { id: "event", label: "System event" },
  { id: "decision", label: "Decision" },
  { id: "state", label: "Entitlement state" },
  { id: "terminal", label: "Terminal outcome" },
  { id: "admin", label: "Administrative action" },
  { id: "tbd", label: "Unresolved policy (TBD)" },
];

/** Edge kinds combine colour + line style + label. */
export type EdgeKind =
  | "success"
  | "failure"
  | "security"
  | "admin"
  | "neutral"
  | "unresolved";

export const EDGE_KINDS: { id: EdgeKind; label: string }[] = [
  { id: "success", label: "Successful path" },
  { id: "failure", label: "Failure / denied path" },
  { id: "security", label: "Identity, authorization & security" },
  { id: "admin", label: "Owner, admin & support action" },
  { id: "neutral", label: "Secondary connection" },
  { id: "unresolved", label: "Unresolved policy (dashed)" },
];

/** Emphasis filters (never hide — only dim non-matching). */
export type Category = "primary" | "payment" | "authz" | "lifecycle" | "exception";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "primary", label: "Primary customer journey" },
  { id: "payment", label: "Payment & provisioning" },
  { id: "authz", label: "Authorization & device controls" },
  { id: "lifecycle", label: "Resource lifecycle" },
  { id: "exception", label: "Exception & support paths" },
];

export interface AccessNode {
  id: string;
  lane: LaneId;
  type: NodeType;
  col: number;
  dy?: number;
  title: string;
  actor: string;
  what: string;
  why?: string;
  next?: string;
  tbd?: boolean;
  cats: Category[];
}

export interface AccessEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  label?: string;
  /** curve the connector downward/upward to reduce crossings */
  bow?: number;
}

export const MAP_META = {
  title: "Superfile Paid Access & Entitlement System",
  subtitle:
    "How payment, identity, authorization, controlled file delivery, and lifecycle management connect.",
  intro:
    "A service blueprint of Superfile's paid file-access experience. The core principle it encodes: payment establishes an entitlement, the entitlement determines access, and access produces a controlled in-app file session — payment alone never grants access. Drag to pan, scroll to zoom, or use the controls; hover or focus any node for what it does, who owns it, and what's still an open policy decision.",
  principle:
    "Payment establishes an entitlement. The entitlement determines access. Access produces a controlled file session.",
};

export const NODES: AccessNode[] = [
  // ---------------- Primary journey ----------------
  {
    id: "request",
    lane: "user",
    type: "process",
    col: 0,
    title: "Request file access",
    actor: "Purchaser / Guest purchaser",
    what: "A user opens a file, file version, or collection they want to view.",
    next: "The app runs an access-control check.",
    cats: ["primary", "authz"],
  },
  {
    id: "sharedLink",
    lane: "user",
    type: "event",
    col: 0,
    dy: -118,
    title: "Shared link opened",
    actor: "Anyone with the link",
    what: "A shared link opens a gated landing page.",
    why: "Sharing a link does not transfer the entitlement or grant access.",
    next: "Routes into the same access-control check.",
    cats: ["primary", "authz"],
  },
  {
    id: "accessCheck",
    lane: "interface",
    type: "process",
    col: 1,
    title: "Access-control check",
    actor: "Product interface",
    what: "The app authorizes before revealing anything.",
    why: "Nothing is unlocked before authorization runs.",
    next: "Evaluate whether an active entitlement exists.",
    cats: ["primary", "authz"],
  },
  {
    id: "hasEntitlement",
    lane: "entitlement",
    type: "decision",
    col: 2,
    title: "Active entitlement?",
    actor: "Entitlement & authorization service",
    what: "Is there a current entitlement for this user and resource?",
    next: "Yes → entitlement check. No → gated landing / pay-to-unlock.",
    cats: ["primary", "authz"],
  },
  {
    id: "gated",
    lane: "interface",
    type: "interface",
    col: 3,
    dy: 40,
    title: "Gated landing / pay-to-unlock",
    actor: "Product interface",
    what: "Shows a gated file landing page or the custom pay-to-unlock interface.",
    why: "A shared link lands here; it never grants access on its own.",
    next: "The user may initiate payment.",
    cats: ["primary", "payment"],
  },
  {
    id: "initiatePay",
    lane: "user",
    type: "process",
    col: 4,
    title: "Initiate payment",
    actor: "Purchaser / Guest purchaser",
    what: "The user starts checkout. No sign-in is required to begin paying.",
    next: "Stripe processes the transaction.",
    cats: ["primary", "payment"],
  },
  {
    id: "accountCreate",
    lane: "identity",
    type: "process",
    col: 4,
    dy: 30,
    title: "Guest → account creation",
    actor: "Identity system",
    what: "A guest purchase begins account creation using the purchaser's email.",
    why: "A purchase is tied to an account + email; you cannot buy access for someone else — gifting is not supported.",
    next: "Requires email verification before access.",
    cats: ["primary", "authz"],
  },
  {
    id: "emailVerify",
    lane: "identity",
    type: "state",
    col: 6,
    dy: 40,
    title: "Email verification",
    actor: "Guest purchaser / Identity system",
    what: "The purchaser must verify ownership of the checkout email before the entitlement can grant access.",
    next: "Verified → the entitlement can grant access.",
    cats: ["primary", "authz"],
  },
  {
    id: "stripe",
    lane: "payment",
    type: "process",
    col: 5,
    title: "Stripe processes transaction",
    actor: "Stripe / payment provider",
    what: "The card is charged through Stripe. Taxes are added and paid by the purchaser; discount codes may apply.",
    why: "Delayed payment methods are not supported.",
    next: "The server awaits a verified confirmation.",
    cats: ["primary", "payment"],
  },
  {
    id: "confirming",
    lane: "interface",
    type: "interface",
    col: 6,
    dy: -108,
    title: "“Confirming payment” state",
    actor: "Product interface",
    what: "While server confirmation is pending, the user sees a loading / confirming state.",
    why: "The browser success screen is NOT authoritative proof of payment.",
    next: "The server validates the confirmation.",
    cats: ["primary", "payment"],
  },
  {
    id: "txnResult",
    lane: "payment",
    type: "decision",
    col: 6,
    title: "Transaction result",
    actor: "Stripe / payment provider",
    what: "Did the charge succeed?",
    next: "Success → verified confirmation. Failure → failure state.",
    cats: ["primary", "payment", "exception"],
  },
  {
    id: "validate",
    lane: "payment",
    type: "event",
    col: 7,
    title: "Verified Stripe payment confirmation",
    actor: "Stripe / payment provider → server",
    what: "The server validates a verified Stripe payment confirmation (server-side, not the browser).",
    why: "The exact Stripe event/webhook is an implementation detail, kept generic here.",
    next: "Match the payment to the account and resource.",
    cats: ["primary", "payment"],
  },
  {
    id: "match",
    lane: "identity",
    type: "process",
    col: 8,
    title: "Match payment → account, email, resource",
    actor: "Identity + entitlement service",
    what: "Payment is matched to the user account, email, resource, and a purchase identifier (UUID).",
    why: "The UUID ties the account, purchased resource, and access permission together.",
    next: "A valid match creates or activates the entitlement.",
    cats: ["primary", "payment", "authz"],
  },
  {
    id: "billingIdentity",
    lane: "identity",
    type: "state",
    col: 8,
    dy: -104,
    title: "Billing identity",
    actor: "Stripe billing",
    what: "The Stripe billing email may differ from the account email.",
    why: "A mismatch does not block payment, but access still attaches to the intended verified account.",
    next: "Related to — but distinct from — account identity.",
    cats: ["payment", "authz"],
  },
  {
    id: "createEntitlement",
    lane: "entitlement",
    type: "process",
    col: 9,
    title: "Create / activate entitlement",
    actor: "Entitlement & authorization service",
    what: "A valid payment creates or activates the entitlement for a file, version, or collection.",
    why: "Payment establishes an entitlement — it does not grant access by itself.",
    next: "The entitlement is checked before any file session.",
    cats: ["primary", "payment", "authz"],
  },
  {
    id: "collection",
    lane: "entitlement",
    type: "tbd",
    col: 9,
    dy: -104,
    title: "Collection entitlement (dynamic)",
    actor: "Entitlement service",
    what: "A collection entitlement includes files added after purchase.",
    next: "What happens when a file is later removed from the collection is a Policy decision required.",
    tbd: true,
    cats: ["lifecycle", "authz"],
  },
  {
    id: "entitlementCheck",
    lane: "entitlement",
    type: "decision",
    col: 10,
    title: "Entitlement check before session",
    actor: "Authorization service",
    what: "The entitlement and its state are checked before a controlled file session is created.",
    next: "Active + verified → device authorization.",
    cats: ["primary", "authz"],
  },
  {
    id: "deviceEval",
    lane: "entitlement",
    type: "decision",
    col: 11,
    dy: 30,
    title: "Device authorization",
    actor: "Authorization service",
    what: "Evaluates the current device. Each entitlement supports up to two registered devices.",
    next: "Registered → continue. New & <2 → register. 2 already → block.",
    cats: ["primary", "authz"],
  },
  {
    id: "deviceRegister",
    lane: "entitlement",
    type: "process",
    col: 12,
    dy: -66,
    title: "Register device",
    actor: "Authorization service",
    what: "A new device is registered when fewer than two are on file.",
    next: "Access may continue on this device.",
    cats: ["authz"],
  },
  {
    id: "deviceLimit",
    lane: "entitlement",
    type: "terminal",
    col: 12,
    dy: 70,
    title: "Device limit reached",
    actor: "Authorization service",
    what: "Two devices are already registered. Viewing is blocked on this device.",
    next: "Device-reset behavior is still TBD.",
    tbd: true,
    cats: ["authz", "exception"],
  },
  {
    id: "deviceTbd",
    lane: "entitlement",
    type: "tbd",
    col: 13,
    dy: 70,
    title: "Device management",
    actor: "TBD",
    what: "Device removal, replacement, reset, cooldown, and support-assisted recovery are not defined.",
    next: "Policy decision required.",
    tbd: true,
    cats: ["authz", "exception"],
  },
  {
    id: "session",
    lane: "delivery",
    type: "process",
    col: 12,
    title: "Controlled in-app streaming & protection",
    actor: "File-delivery service",
    what: "The original file is protected from direct public access and streamed through the app; authorization happens before unlock.",
    why: "Supports download limits, watermarking, and device restrictions; access can be invalidated after revocation.",
    next: "The user accesses the content in-app.",
    cats: ["primary", "authz"],
  },
  {
    id: "userAccess",
    lane: "user",
    type: "terminal",
    col: 13,
    title: "User accesses the file",
    actor: "Authenticated user",
    what: "The user views or downloads the content through the app.",
    next: "Views and downloads are logged.",
    cats: ["primary"],
  },

  // ---------------- Payment failure / retry ----------------
  {
    id: "duplicateGuard",
    lane: "payment",
    type: "tbd",
    col: 5,
    dy: 96,
    title: "Duplicate-purchase guard",
    actor: "Payment service",
    what: "The system is intended to prevent multiple checkout sessions and duplicate purchases.",
    next: "The exact duplicate-event handling is an unresolved operational detail.",
    tbd: true,
    cats: ["payment", "exception"],
  },
  {
    id: "stripeUnavailable",
    lane: "payment",
    type: "tbd",
    col: 5,
    dy: 190,
    title: "Stripe unavailable",
    actor: "TBD",
    what: "The recovery behavior when Stripe is unavailable is not defined.",
    next: "Operational policy decision required.",
    tbd: true,
    cats: ["payment", "exception"],
  },
  {
    id: "failState",
    lane: "interface",
    type: "state",
    col: 7,
    dy: 96,
    title: "Payment failed",
    actor: "Product interface",
    what: "A failed payment leads to a clear failure state.",
    next: "The user may retry.",
    cats: ["payment", "exception"],
  },
  {
    id: "retryDecision",
    lane: "user",
    type: "decision",
    col: 8,
    dy: 96,
    title: "Retry?",
    actor: "Purchaser",
    what: "The user chooses whether to retry the payment.",
    next: "Yes → initiate payment. No → no access.",
    cats: ["payment", "exception"],
  },
  {
    id: "noAccess",
    lane: "user",
    type: "terminal",
    col: 9,
    dy: 96,
    title: "No access (not purchased)",
    actor: "Purchaser",
    what: "If the user does not retry, they end without access.",
    next: "They can start a new purchase later.",
    cats: ["payment", "exception"],
  },

  // ---------------- Payment + provisioning exception ----------------
  {
    id: "provFailed",
    lane: "entitlement",
    type: "state",
    col: 9,
    dy: 96,
    title: "Provisioning failed",
    actor: "Entitlement service / Support",
    what: "Payment succeeded, but access was not created.",
    why: "The user must not be charged again.",
    next: "Support can locate and reconcile the purchase.",
    cats: ["payment", "exception"],
  },
  {
    id: "notify",
    lane: "audit",
    type: "event",
    col: 10,
    dy: -30,
    title: "Notify owner, user & admins",
    actor: "Monitoring & notification",
    what: "The file owner, affected user, and platform administrators are notified of the provisioning failure.",
    next: "Support picks up the reconciliation.",
    cats: ["exception"],
  },
  {
    id: "supportReconcile",
    lane: "admin",
    type: "admin",
    col: 10,
    dy: 30,
    title: "Support reconciles purchase",
    actor: "Support / operations agent",
    what: "Support can locate the purchase and manually reconcile it with the entitlement.",
    next: "Restores the intended access without a second charge.",
    cats: ["exception"],
  },
  {
    id: "provRecoveryTbd",
    lane: "admin",
    type: "tbd",
    col: 11,
    dy: 30,
    title: "Automated recovery",
    actor: "TBD",
    what: "The final automated recovery policy for provisioning failure is not yet defined.",
    next: "TBD.",
    tbd: true,
    cats: ["exception"],
  },

  // ---------------- Complimentary access (admin) ----------------
  {
    id: "compGrant",
    lane: "admin",
    type: "admin",
    col: 8,
    dy: -30,
    title: "Grant complimentary access",
    actor: "Platform administrator",
    what: "Admins grant complimentary access through a separate entitlement-creation path — no payment occurs.",
    next: "Enters the same authorization and delivery checks as a paid entitlement.",
    cats: ["authz", "exception"],
  },

  // ---------------- File owner: resource lifecycle ----------------
  {
    id: "ownerReplace",
    lane: "owner",
    type: "admin",
    col: 11,
    dy: -20,
    title: "Replace / archive / delete file",
    actor: "File owner",
    what: "If the owner replaces, archives, or deletes a file, the purchaser loses access.",
    why: "“Permanent” access does not survive the owner removing the product.",
    next: "→ Entitlement: Resource unavailable.",
    cats: ["lifecycle"],
  },
  {
    id: "ownerRevoke",
    lane: "owner",
    type: "admin",
    col: 10,
    dy: -20,
    title: "Owner-initiated revoke",
    actor: "File owner",
    what: "A paid entitlement cannot be revoked by the owner without a refund.",
    next: "Revoke a paid entitlement → refund required → Revoked.",
    cats: ["lifecycle"],
  },
  {
    id: "refundRulePolicy",
    lane: "owner",
    type: "tbd",
    col: 12,
    dy: -20,
    title: "Replace/archive/delete ↔ refund",
    actor: "Policy",
    what: "The relationship between owner replacement/archival/deletion and the paid-revocation-refund rule is unresolved.",
    next: "Policy decision required — do not assume every change triggers a refund.",
    tbd: true,
    cats: ["lifecycle"],
  },
  {
    id: "restoreRule",
    lane: "owner",
    type: "process",
    col: 13,
    dy: -20,
    title: "Restoring access",
    actor: "File owner / Admin",
    what: "A revoked entitlement cannot simply be restored.",
    next: "Requires a new purchase or a separate complimentary grant.",
    cats: ["lifecycle"],
  },

  // ---------------- Entitlement lifecycle states (distinct) ----------------
  {
    id: "stAwaitingEmail",
    lane: "entitlement",
    type: "state",
    col: 6.6,
    dy: -104,
    title: "Awaiting email verification",
    actor: "Identity system",
    what: "The entitlement can't grant access until the checkout email is verified.",
    next: "Verify email → proceed.",
    cats: ["authz"],
  },
  {
    id: "stAwaitingPayment",
    lane: "entitlement",
    type: "state",
    col: 7.6,
    dy: -104,
    title: "Awaiting payment confirmation",
    actor: "Entitlement service",
    what: "Waiting on a verified Stripe confirmation before activation.",
    next: "Confirmed → Provisioning.",
    cats: ["payment", "authz"],
  },
  {
    id: "stActive",
    lane: "entitlement",
    type: "state",
    col: 10,
    dy: -104,
    title: "Active entitlement",
    actor: "Authorization service",
    what: "A current permission for a file, file version, or collection.",
    why: "Payment status alone does not grant access.",
    next: "Passes authorization + device checks → session.",
    cats: ["primary", "authz"],
  },
  {
    id: "stExpired",
    lane: "entitlement",
    type: "state",
    col: 11,
    dy: -104,
    title: "Expired",
    actor: "Authorization service",
    what: "A time-limited entitlement reached the end of its owner-set duration.",
    next: "Access ends; a new purchase is required.",
    cats: ["lifecycle"],
  },
  {
    id: "stRevoked",
    lane: "entitlement",
    type: "state",
    col: 13,
    dy: -104,
    title: "Revoked",
    actor: "Authorization service",
    what: "Access is invalidated; previously issued access no longer works.",
    next: "Cannot be simply restored — needs a new purchase or complimentary grant.",
    cats: ["lifecycle", "payment"],
  },
  {
    id: "stRefunded",
    lane: "entitlement",
    type: "state",
    col: 12,
    dy: -180,
    title: "Refunded",
    actor: "Payment + entitlement service",
    what: "A refund automatically revoked the entitlement.",
    next: "→ Revoked.",
    cats: ["lifecycle", "payment"],
  },
  {
    id: "stDisputed",
    lane: "entitlement",
    type: "state",
    col: 12,
    dy: -104,
    title: "Disputed / charged back",
    actor: "Payment + entitlement service",
    what: "A chargeback automatically revoked the entitlement.",
    next: "→ Revoked.",
    cats: ["lifecycle", "payment"],
  },
  {
    id: "stResourceUnavailable",
    lane: "entitlement",
    type: "state",
    col: 12,
    dy: 40,
    title: "Resource unavailable",
    actor: "File owner / Authorization service",
    what: "The purchaser loses access when the resource is replaced, archived, or deleted.",
    next: "The related refund policy still requires clarification.",
    tbd: true,
    cats: ["lifecycle"],
  },

  // ---------------- Refund / chargeback events ----------------
  {
    id: "refund",
    lane: "payment",
    type: "event",
    col: 11,
    dy: -180,
    title: "Refund issued",
    actor: "Stripe / admin",
    what: "A refund automatically revokes the entitlement.",
    next: "→ Entitlement: Refunded → Revoked.",
    cats: ["lifecycle", "payment"],
  },
  {
    id: "chargeback",
    lane: "payment",
    type: "event",
    col: 11,
    dy: -104,
    title: "Chargeback / dispute",
    actor: "Stripe",
    what: "A chargeback automatically revokes the entitlement.",
    next: "→ Entitlement: Disputed → Revoked.",
    cats: ["lifecycle", "payment"],
  },

  // ---------------- Audit ----------------
  {
    id: "logViews",
    lane: "audit",
    type: "event",
    col: 13,
    title: "Log views & downloads",
    actor: "Monitoring & audit",
    what: "File views and downloads are logged.",
    next: "Feeds the audit log.",
    cats: ["primary"],
  },
  {
    id: "auditLog",
    lane: "audit",
    type: "process",
    col: 11,
    dy: 40,
    title: "Audit log",
    actor: "Monitoring & audit",
    what: "Logs views, downloads, payment/refund relationships, entitlement changes, admin access changes, and device-authorization outcomes.",
    cats: ["primary", "exception", "lifecycle"],
  },
  {
    id: "retentionTbd",
    lane: "audit",
    type: "tbd",
    col: 12,
    dy: 40,
    title: "Audit-log retention policy: TBD",
    actor: "TBD",
    what: "The retention duration is not defined.",
    next: "TBD — no compliance claims.",
    tbd: true,
    cats: ["exception"],
  },
];

export const EDGES: AccessEdge[] = [
  // primary happy path
  { from: "request", to: "accessCheck", kind: "success" },
  { from: "sharedLink", to: "accessCheck", kind: "security", label: "gated — no bypass" },
  { from: "accessCheck", to: "hasEntitlement", kind: "success" },
  { from: "hasEntitlement", to: "gated", kind: "neutral", label: "No entitlement" },
  { from: "hasEntitlement", to: "entitlementCheck", kind: "success", label: "Active entitlement", bow: -70 },
  { from: "gated", to: "initiatePay", kind: "success", label: "Pay to unlock" },
  { from: "initiatePay", to: "stripe", kind: "success" },
  { from: "initiatePay", to: "accountCreate", kind: "security", label: "Guest" },
  { from: "accountCreate", to: "emailVerify", kind: "security" },
  { from: "emailVerify", to: "createEntitlement", kind: "security", label: "Verified before access", bow: 40 },
  { from: "stripe", to: "txnResult", kind: "neutral" },
  { from: "txnResult", to: "validate", kind: "success", label: "Success" },
  { from: "confirming", to: "validate", kind: "neutral", label: "Not authoritative" },
  { from: "stripe", to: "confirming", kind: "neutral" },
  { from: "validate", to: "match", kind: "success" },
  { from: "billingIdentity", to: "match", kind: "security", label: "related, distinct" },
  { from: "match", to: "createEntitlement", kind: "success", label: "Valid match" },
  { from: "createEntitlement", to: "entitlementCheck", kind: "success" },
  { from: "entitlementCheck", to: "deviceEval", kind: "success", label: "Active + verified" },
  { from: "deviceEval", to: "deviceRegister", kind: "success", label: "New & <2" },
  { from: "deviceEval", to: "session", kind: "success", label: "Registered" },
  { from: "deviceRegister", to: "session", kind: "success" },
  { from: "deviceEval", to: "deviceLimit", kind: "failure", label: "2 registered" },
  { from: "deviceLimit", to: "deviceTbd", kind: "unresolved" },
  { from: "session", to: "userAccess", kind: "success" },
  { from: "userAccess", to: "logViews", kind: "neutral" },
  { from: "logViews", to: "auditLog", kind: "neutral", bow: 30 },

  // payment failure / retry
  { from: "txnResult", to: "failState", kind: "failure", label: "Failure" },
  { from: "failState", to: "retryDecision", kind: "failure" },
  { from: "retryDecision", to: "initiatePay", kind: "success", label: "Yes", bow: 60 },
  { from: "retryDecision", to: "noAccess", kind: "failure", label: "No" },
  { from: "stripe", to: "duplicateGuard", kind: "neutral" },

  // provisioning exception
  { from: "createEntitlement", to: "provFailed", kind: "failure", label: "Provisioning fails" },
  { from: "provFailed", to: "notify", kind: "neutral" },
  { from: "provFailed", to: "supportReconcile", kind: "admin" },
  { from: "supportReconcile", to: "createEntitlement", kind: "admin", label: "Reconcile (no re-charge)", bow: -40 },
  { from: "supportReconcile", to: "provRecoveryTbd", kind: "unresolved" },

  // complimentary access
  { from: "compGrant", to: "createEntitlement", kind: "admin", label: "Complimentary (no payment)" },

  // entitlement states
  { from: "accountCreate", to: "stAwaitingEmail", kind: "security", bow: -30 },
  { from: "match", to: "stAwaitingPayment", kind: "neutral", bow: -30 },
  { from: "createEntitlement", to: "stActive", kind: "success", bow: -40 },
  { from: "stActive", to: "stExpired", kind: "neutral", label: "Time limit" },
  { from: "refund", to: "stRefunded", kind: "failure" },
  { from: "chargeback", to: "stDisputed", kind: "failure" },
  { from: "stRefunded", to: "stRevoked", kind: "failure" },
  { from: "stDisputed", to: "stRevoked", kind: "failure" },
  { from: "stExpired", to: "stRevoked", kind: "neutral" },
  { from: "stResourceUnavailable", to: "stRevoked", kind: "failure", bow: -50 },

  // owner lifecycle
  { from: "ownerReplace", to: "stResourceUnavailable", kind: "admin" },
  { from: "ownerRevoke", to: "refund", kind: "admin", label: "Refund required" },
  { from: "ownerReplace", to: "refundRulePolicy", kind: "unresolved" },
  { from: "stRevoked", to: "restoreRule", kind: "neutral" },

  // audit / retention
  { from: "auditLog", to: "retentionTbd", kind: "unresolved" },
];
